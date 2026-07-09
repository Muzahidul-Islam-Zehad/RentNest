import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { config } from "../../config";
import { PaymentProvider, PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { IConfirmPayment, ICreatePaymentSession } from "./payments.interface";

type TCheckoutSession = {
	id: string;
	url: string;
	payment_status?: string;
};

const stripe = new Stripe(config.stripe_secret_key);

const getSuccessUrl = () => {
	const successUrl = config.stripe_success_url;
	return successUrl.includes("{CHECKOUT_SESSION_ID}")
		? successUrl
		: `${successUrl}${successUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;
};

const createPaymentSessionInDB = async (payload: ICreatePaymentSession, tenantId: string) => {
	const { rentalRequestId } = payload;

	if (!rentalRequestId || !tenantId) {
		throw new AppError("Rental request and tenant are required", httpStatus.BAD_REQUEST);
	}

	const paymentSession = await prisma.$transaction(async (tx) => {
		const rentalRequest = await tx.rentalRequest.findFirst({
			where: {
				id: rentalRequestId,
				tenantId,
			},
			include: {
				property: true,
				payment: true,
			},
		});

		if (!rentalRequest) {
			throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
		}

		if (rentalRequest.status !== RentalStatus.APPROVED) {
			throw new AppError("Payment can only be created for an approved rental", httpStatus.BAD_REQUEST);
		}

		if (rentalRequest.payment?.status === PaymentStatus.COMPLETED) {
			throw new AppError("This rental has already been paid", httpStatus.CONFLICT);
		}

		const amount = rentalRequest.property.price;

		const paymentRecord = await tx.payment.upsert({
			where: {
				rentalRequestId,
			},
			update: {
				amount,
				currency: config.stripe_currency.toUpperCase(),
				provider: PaymentProvider.STRIPE,
				status: PaymentStatus.PENDING,
				metadata: {
					rentalRequestId,
					propertyId: rentalRequest.propertyId,
					tenantId,
					mode: "stripe",
				},
			},
			create: {
				rentalRequestId,
				amount,
				currency: config.stripe_currency.toUpperCase(),
				provider: PaymentProvider.STRIPE,
				status: PaymentStatus.PENDING,
				metadata: {
					rentalRequestId,
					propertyId: rentalRequest.propertyId,
					tenantId,
					mode: "stripe",
				},
			},
		});

		const createdSession = await stripe.checkout.sessions.create({
			mode: "payment",
			success_url: getSuccessUrl(),
			cancel_url: config.stripe_cancel_url,
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: config.stripe_currency,
						unit_amount: Math.round(amount * 100),
						product_data: {
							name: `RentNest rental for ${rentalRequest.property.title}`,
							description: rentalRequest.property.location,
						},
					},
				},
			],
			metadata: {
				paymentId: paymentRecord.id,
				rentalRequestId,
				tenantId,
			},
		});

		const session: TCheckoutSession = {
			id: createdSession.id,
			url: createdSession.url ?? getSuccessUrl(),
			payment_status: createdSession.payment_status ?? undefined,
		};

		const updatedPayment = await tx.payment.update({
			where: {
				id: paymentRecord.id,
			},
			data: {
				transactionId: session.id,
				metadata: {
					rentalRequestId,
					propertyId: rentalRequest.propertyId,
					tenantId,
					sessionId: session.id,
					checkoutUrl: session.url,
					mode: "stripe",
				},
			},
			include: {
				rentalRequest: {
					include: {
						property: true,
					},
				},
			},
		});

		return {
			payment: updatedPayment,
			checkoutSession: session,
		};
	});

	return paymentSession;
};

const confirmPaymentInDB = async (sessionId: string, tenantId: string) => {

    console.log("from sevice: ", sessionId, tenantId);

	if (!sessionId || !tenantId) {
		throw new AppError("Session and tenant are required", httpStatus.BAD_REQUEST);
	}

	const confirmedPayment = await prisma.$transaction(async (tx) => {
		const payment = await tx.payment.findFirst({
			where: {
				transactionId: sessionId,
				rentalRequest: {
					tenantId,
				},
			},
			include: {
				rentalRequest: true,
			},
		});

		if (!payment) {
			throw new AppError("Payment session not found", httpStatus.NOT_FOUND);
		}

		if (payment.status === PaymentStatus.COMPLETED) {
			return payment;
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			throw new AppError("Payment is not completed yet", httpStatus.BAD_REQUEST);
		}

		const updatedPayment = await tx.payment.update({
			where: {
				id: payment.id,
			},
			data: {
				status: PaymentStatus.COMPLETED,
				paidAt: new Date(),
				metadata: {
					...(payment.metadata as Record<string, unknown> | null ?? {}),
					confirmedAt: new Date().toISOString(),
					confirmationMode: "stripe",
                    checkoutUrl: null
				},
			},
			include: {
				rentalRequest: {
					include: {
						property: true,
					},
				},
			},
		});

		await tx.rentalRequest.update({
			where: {
				id: payment.rentalRequestId,
			},
			data: {
				status: RentalStatus.COMPLETED,
			},
		});

		return updatedPayment;
	});

	return confirmedPayment;
};

const handleWebhookInDB = async (rawBody: Buffer | string, signature: string) => {
	if (!signature) {
		throw new AppError("Missing Stripe signature", httpStatus.BAD_REQUEST);
	}

	const event = stripe.webhooks.constructEvent(rawBody, signature, config.stripe_webhook_secret);

	if (event.type !== "checkout.session.completed") {
		return { received: true, type: event.type };
	}

	const session = event.data.object as Stripe.Checkout.Session;
	const paymentId = session.metadata?.paymentId;

	if (!paymentId) {
		throw new AppError("Missing payment metadata", httpStatus.BAD_REQUEST);
	}

	await prisma.$transaction(async (tx) => {
		const payment = await tx.payment.findUnique({
			where: {
				id: paymentId,
			},
		});

		if (!payment || payment.status === PaymentStatus.COMPLETED) {
			return;
		}

		await tx.payment.update({
			where: {
				id: paymentId,
			},
			data: {
				transactionId: session.id,
				status: PaymentStatus.COMPLETED,
				paidAt: new Date(),
				metadata: {
					...(payment.metadata as Record<string, unknown> | null ?? {}),
					webhookEventId: event.id,
					confirmationMode: "webhook",
				},
			},
		});

		await tx.rentalRequest.update({
			where: {
				id: payment.rentalRequestId,
			},
			data: {
				status: RentalStatus.COMPLETED,
			},
		});
	});

	return { received: true, type: event.type };
};

const getMyPaymentsInDB = async (tenantId: string) => {
	if (!tenantId) {
		throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
	}

	const payments = await prisma.payment.findMany({
		where: {
			rentalRequest: {
				tenantId,
			},
		},
		include: {
			rentalRequest: {
				include: {
					property: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return payments;
};

const getPaymentByIdInDB = async (paymentId: string, tenantId: string) => {
	if (!paymentId || !tenantId) {
		throw new AppError("Payment and tenant are required", httpStatus.BAD_REQUEST);
	}

	const payment = await prisma.payment.findFirst({
		where: {
			id: paymentId,
			rentalRequest: {
				tenantId,
			},
		},
		include: {
			rentalRequest: {
				include: {
					property: true,
				},
			},
		},
	});

	if (!payment) {
		throw new AppError("Payment not found", httpStatus.NOT_FOUND);
	}

	return payment;
};

export const paymentsService = {
	createPaymentSessionInDB,
	confirmPaymentInDB,
	handleWebhookInDB,
	getMyPaymentsInDB,
	getPaymentByIdInDB,
};

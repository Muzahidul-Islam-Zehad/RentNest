import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { response } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { paymentsService } from "./payments.service";
import { Jwt, JwtPayload } from "jsonwebtoken";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
	const { rentalRequestId } = req.body;
	const tenantId = req.user?.userId as string;
	const result = await paymentsService.createPaymentSessionInDB({ rentalRequestId }, tenantId);
	response(res, {
		status: HttpStatus.OK,
		success: true,
		message: "Payment session created successfully",
		data: result,
	});
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
	const sessionId = req.body.sessionId || req.query.session_Id as string;
	const tenantId = req.user?.userId as JwtPayload["userId"];
	const result = await paymentsService.confirmPaymentInDB( sessionId as string , tenantId);

	response(res, {
		status: HttpStatus.OK,
		success: true,
		message: "Payment confirmed successfully",
		data: result,
	});
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
	const signature = req.headers["stripe-signature"] as string;
	const result = await paymentsService.handleWebhookInDB(req.body, signature);

	res.status(HttpStatus.OK).json(result);
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
	const tenantId = req.user?.userId as string;
	const result = await paymentsService.getMyPaymentsInDB(tenantId);

	response(res, {
		status: HttpStatus.OK,
		success: true,
		message: "Payment history fetched successfully",
		data: result,
	});
});

const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {
	const paymentId = req.params.id;
	const tenantId = req.user?.userId as string;
	const result = await paymentsService.getPaymentByIdInDB(paymentId as string, tenantId);

	response(res, {
		status: HttpStatus.OK,
		success: true,
		message: "Payment details fetched successfully",
		data: result,
	});
});

export const paymentsController = {
	createPaymentSession,
	confirmPayment,
	handleWebhook,
	getMyPayments,
	getPaymentDetails,
};

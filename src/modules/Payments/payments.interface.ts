export interface ICreatePaymentSession {
	rentalRequestId: string;
}

export interface IConfirmPayment {
	sessionId: string;
}

export interface IPaymentHistoryQuery {
	tenantId: string;
}

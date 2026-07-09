import { Router } from "express";
import { paymentsController } from "./payments.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.post("/create", authMiddleware("TENANT"), paymentsController.createPaymentSession);
router.post("/confirm", authMiddleware("TENANT"), paymentsController.confirmPayment);
router.get("/", authMiddleware("TENANT"), paymentsController.getMyPayments);
router.get("/:id", authMiddleware("TENANT"), paymentsController.getPaymentDetails);
router.post("/webhook", paymentsController.handleWebhook);
export const paymentsRouter = {
	router,
};

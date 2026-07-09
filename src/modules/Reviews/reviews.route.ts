import { Router } from "express";
import { reviewsController } from "./reviews.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router()

router.post("/:id", authMiddleware('TENANT'),reviewsController.postReview)

export const reviewsRouter = {
    router
}
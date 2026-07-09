import { response } from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { reviewsService } from "./reviews.service";
import { Request, Response } from "express";
import HttpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";


const postReview = catchAsync(
    async (req: Request, res: Response) => {
        const reviewData = req.body;
        const propertyId = req.params.id;
        const tenantId = req.user?.userId as JwtPayload["userId"];
        const result = await reviewsService.postReviewInDB(reviewData, tenantId, propertyId as string);
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Review posted successfully",
            data: result,
        });
    })




export const reviewsController = {
    postReview
}
import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError"
import { IPostReview } from "./reviews.interface"
import HttpStatus from "http-status"
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums"

const postReviewInDB = async (reviewData: IPostReview, tenantId: string, propertyId: string) => {

    const reviewTransaction = await prisma.$transaction(async (tx) => {

        const isPropertyExists = await tx.property.findUnique({
            where: {
                id: propertyId
            }
        })
        if (!isPropertyExists) {
            throw new AppError("Property not found", HttpStatus.NOT_FOUND);
        }

        const isCompletedRequestExists = await tx.rentalRequest.findFirst({
            where: {
                propertyId,
                tenantId,
                status: RentalStatus.APPROVED,
                payment: {
                    status: PaymentStatus.COMPLETED
                }
            }
        })
        if (!isCompletedRequestExists) {
            throw new AppError("You haven't paid for this property yet, you can only review after payment", HttpStatus.BAD_REQUEST);
        }

        const existingReview = await tx.review.findFirst({
            where: {
                propertyId,
                tenantId,
            }
        })

        if (existingReview) {
            throw new AppError("You have already reviewed this property", HttpStatus.CONFLICT);
        }

        const review = await tx.review.create({
            data: {
                propertyId,
                tenantId,
                rating: reviewData.rating,
                comment: reviewData.comment
            }
        })

        return review;
    })

    return reviewTransaction;
}

export const reviewsService = {
    postReviewInDB
}
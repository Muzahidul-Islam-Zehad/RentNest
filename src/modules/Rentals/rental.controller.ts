import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { response } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";
import  HttpStatus  from "http-status"

const submitRentalRequest = catchAsync(
    async (req, res) => {
        const rentalData = req.body;
        const propertyId = req.params.id;
        const tenantId = req.user?.userId as JwtPayload; 

        const result = await rentalService.submitRentalRequestInDB({ ...rentalData, propertyId, tenantId });
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Rental request submitted successfully",
            data: result,
        });
    }
);

const getRentalRequestsByTenant = catchAsync(
    async (req, res) => {
        const tenantId = req.user?.userId as JwtPayload["userId"];
        const result = await rentalService.getRentalRequestsByTenantInDB(tenantId);
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Rental requests retrieved successfully",
            data: result,
        });
    }
);

const getRentalRequestById = catchAsync(
    async (req, res) => {
        const rentalRequestId = req.params.id;
        const tenantId = req.user?.userId as JwtPayload["userId"];
        const result = await rentalService.getRentalRequestByIdInDB(rentalRequestId as string, tenantId);
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Rental request retrieved successfully",
            data: result,
        });
    }
)

export const rentalController = {
    submitRentalRequest,
    getRentalRequestsByTenant,
    getRentalRequestById
};  
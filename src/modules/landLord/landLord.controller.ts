import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { landlordsService } from "./landLord.service";
import { IPropertyListing, IUpdateRequestStatus } from "./landLord.interface";
import { response } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { RentalStatus } from "../../../generated/prisma/client";


const createPropertyListing = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body as IPropertyListing;
        const landlordId = req.user?.userId as JwtPayload["userId"];
        const result = await landlordsService.createPropertyListingInDB(payload, landlordId)

        response(res, {
            status: HttpStatus.CREATED,
            success: true,
            message: "Property listing created successfully",
            data: result
        })
    }
)

const getAllPropertyListingsByLandlord = catchAsync(
    async (req: Request, res: Response) => {
        const landlordId = req.user?.userId as JwtPayload["userId"];
        const listings = await landlordsService.getAllPropertyListingsByLandlord(landlordId);
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Property listings fetched successfully",
            data: listings
        });
    }
)   

const updatePropertyListing = catchAsync(
    async (req: Request, res: Response) => {
        const propertyId = req.params.id;
        const payload = req.body as IPropertyListing;
        const landlordId = req.user?.userId as JwtPayload["userId"];
        const updatedListing = await landlordsService.updatePropertyListingInDB(propertyId as string, payload, landlordId);

        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Property listing updated successfully",
            data: updatedListing
        });
    }
)

const getAllRequestsByTenant = catchAsync(
    async (req: Request, res: Response) => {
        const landlordId = req.user?.userId as JwtPayload["userId"];
        const requests = await landlordsService.getAllRequestsByTenant(landlordId);
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Tenant requests fetched successfully",
            data: requests
        });
    }
)

const updateRequestStatus = catchAsync(
    async (req: Request, res: Response) => {
        const requestId = req.params.id;
        const payload = req.body as IUpdateRequestStatus;
        const landlordId = req.user?.userId as JwtPayload["userId"];
        const updatedRequest = await landlordsService.updateRequestStatusInDB(requestId as string, payload, landlordId);

        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Request status updated successfully",
            data: updatedRequest
        });
    }
)

const updatePropertyStatus = catchAsync(
    async (req: Request, res: Response) => {
        const propertyId = req.params.id;
        const { status } = req.body;
        const landlordId = req.user?.userId as JwtPayload["userId"];
        const updatedProperty = await landlordsService.updatePropertyStatusInDB(propertyId as string, status, landlordId);
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Property status updated successfully",
            data: updatedProperty
        });
    }
)

export const landLordsController = {
    createPropertyListing,
    getAllPropertyListingsByLandlord,
    updatePropertyListing,
    getAllRequestsByTenant,
    updateRequestStatus,
    updatePropertyStatus
}
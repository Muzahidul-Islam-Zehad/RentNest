import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { landlordsService } from "./landLord.service";
import { IPropertyListing } from "./landLord.interface";
import { response } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";


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

export const landLordsController = {
    createPropertyListing,
    getAllPropertyListingsByLandlord,
    updatePropertyListing,
    getAllRequestsByTenant
}
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { response } from "../../utils/sendResponse";
import { propertyServices } from "./properties.service";
import httpStatus from "http-status";

const getAllProperties = catchAsync(
    async (req: Request, res: Response) => {
        const properties = await propertyServices.getAllProperties();
        response(res, {
            status: httpStatus.OK,
            success: true,
            message: "Properties fetched successfully",
            data: properties
        });
    }
)

const getPropertyById = catchAsync(
    async (req: Request, res: Response) => {
        const propertyId = req.params.id;
        const property = await propertyServices.getPropertyById(propertyId as string);
        response(res, {
            status: httpStatus.OK,
            success: true,
            message: "Property fetched successfully",
            data: property
        });
    }
)

export const propertyController = {
    getAllProperties,
    getPropertyById
    
}
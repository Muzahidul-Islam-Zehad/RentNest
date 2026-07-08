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

export const landLordsController = {
    createPropertyListing
}
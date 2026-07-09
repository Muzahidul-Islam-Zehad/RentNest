import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { response } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import HttpStatus from "http-status";


const getAllUsers = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminService.getAllUsers();
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "All users fetched successfully",
            data: result
        });
    }
    
)

const updateUserStatus = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.id;
        const { status } = req.body;
        const result = await adminService.updateUserStatus(userId as string, status);
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "User status updated successfully",
            data: result
        });
    }
)

const getAllProperties = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminService.getAllProperties();
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "All properties fetched successfully",
            data: result
        });
    }
)

const getAllRentalRequests = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminService.getAllRentalRequests();
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "All rental requests fetched successfully",
            data: result
        });
    }
)


export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests
}
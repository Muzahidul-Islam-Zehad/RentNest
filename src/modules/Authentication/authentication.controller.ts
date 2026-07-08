import { Request, Response } from "express";
import { authServices } from "./authentication.service";
import { response } from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authServices.registerUser(payload);
    response(res, {
        status: httpStatus.CREATED,
        message: "User registered successfully",
        data: result
    })
})

export const authController = {
    registerUser
}

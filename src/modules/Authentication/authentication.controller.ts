import { Request, Response } from "express";
import { authServices } from "./authentication.service";
import { response } from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authServices.registerUser(payload);
    response(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result
    })
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authServices.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    response(res, {
        status: httpStatus.OK,
        success: true,      
        message: "User logged in successfully",
        data: { accessToken, refreshToken }
    })

})

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as JwtPayload["userId"];
    const user = await authServices.getMe(userId);
    response(res, {
        status: httpStatus.OK,
        success: true,
        message: "User retrieved successfully",
        data: user
    })
})

const updateCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as JwtPayload["userId"];
    const payload = req.body;
    const updatedUser = await authServices.updateMe(userId, payload);
    response(res, {
        status: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: updatedUser
    })
})

export const authController = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateCurrentUser
}

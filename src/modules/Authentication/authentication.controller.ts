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

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authServices.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    response(res, {
        status: httpStatus.OK,
        message: "User logged in successfully",
        data: { accessToken, refreshToken }
    })

})

export const authController = {
    registerUser,
    loginUser
}

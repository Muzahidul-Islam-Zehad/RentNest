import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error : ", err);

    const statusCode = typeof err?.statusCode === "number"
        ? err.statusCode
        : typeof err?.status === "number"
            ? err.status
            : httpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = err?.message || "Internal Server Error";
    const errorName = err?.name || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        name: errorName,
        message: errorMessage,
        error: err?.stack
    })
}
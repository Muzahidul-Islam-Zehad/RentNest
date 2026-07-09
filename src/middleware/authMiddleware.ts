import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { config } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums";
import catchAsync from "../utils/catchAsync";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (...roles: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError("Unauthorized", 401);
        }

        //verify the access token
        const decoded = verifyAccessToken(accessToken as string) as JwtPayload;

        if (!decoded) {
            throw new AppError("Unauthorized", 401);
        }

        if (roles.length && !roles.includes(decoded.role)) {
            throw new AppError("Forbidden", 403);
        }

        req.user = decoded;

        next();
    })
}
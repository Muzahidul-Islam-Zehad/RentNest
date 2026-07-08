import { config } from "../config";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "./AppError";

export const createAccessToken = (payload: object): string => {
    const accessToken = jwt.sign(payload, config.jwt_access_token_secret as string, { expiresIn: config.jwt_access_token_expires_in } as SignOptions);
    return accessToken;
}

export const createRefreshToken = (payload: object): string => {
    const refreshToken = jwt.sign(payload, config.jwt_refresh_token_secret as string, { expiresIn: config.jwt_refresh_token_expires_in } as SignOptions);
    return refreshToken;
}

export const verifyAccessToken = (token: string): object | null => {
    try {
        const decoded = jwt.verify(token, config.jwt_access_token_secret as string);
        if(decoded && typeof decoded === "string") {
            throw new AppError("Invalid token", 401);
        }
        return decoded as JwtPayload;
    } catch (error) {
        return null;
    }
}
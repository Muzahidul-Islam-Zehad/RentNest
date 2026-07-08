import { Request, Response } from "express";
import { ILoginRequest, IRegisterRequest } from "./authentication.interface";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config";
import httpStatus from "http-status";
import AppError from "../../utils/AppError";


const registerUser = async (payload: IRegisterRequest) => {
    const { email, password, role } = payload;

    if (!email || !password || !role) {
        throw new AppError("Email, password and role are required", httpStatus.BAD_REQUEST)
    }
    const newrole = role.toUpperCase()
    if (newrole === "ADMIN") {
        throw new AppError("You cannot register as an admin", httpStatus.FORBIDDEN)
    }
    if (newrole !== "TENANT" && newrole !== "LANDLORD") {
        throw new AppError("Invalid role. Please specify either 'TENANT' or 'LANDLORD'", httpStatus.BAD_REQUEST)
    }

    const userTransaction = await prisma.$transaction(async (tx) => {

        const isUserExist = await tx.user.findUnique({
            where: {
                email
            }
        })

        if (isUserExist) {
            throw new AppError("User already exists", httpStatus.CONFLICT)
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: newrole
            },
            omit: {
                password: true
            }
        })

        return user
    })


    return userTransaction

}

const loginUser = async (payload: ILoginRequest) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new AppError("Email and password are required", httpStatus.BAD_REQUEST);
    }

    const userTransaction = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
        }

        if (user.status === "BANNED") {
            throw new AppError("Your account has been banned. Please contact support for assistance.", httpStatus.FORBIDDEN);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
        }

        const accessToken = jwt.sign({ userId: user.id, email: user.email, status: user.status, role: user.role }, config
            .jwt_access_token_secret as string, { expiresIn: config.jwt_access_token_expires_in } as SignOptions
        );

        const refreshToken = jwt.sign({ userId: user.id, email: user.email, status: user.status, role: user.role }, config
            .jwt_refresh_token_secret as string, { expiresIn: config.jwt_refresh_token_expires_in } as SignOptions
        );
        
        return {
            accessToken,
            refreshToken
        }

    })

    return userTransaction;

    // const user = await prisma.user.findUnique({
    //     where: {
    //         email
    //     }
    // });

    // if (!user) {
    //     throw new Error("Invalid email or password");
    // }

    // const isPasswordMatch = await bcrypt.compare(password, user.password);

    // if (!isPasswordMatch) {
    //     throw new Error("Invalid email or password");
    // }

    // return user;
};




export const authServices = {
    registerUser,
    loginUser
}
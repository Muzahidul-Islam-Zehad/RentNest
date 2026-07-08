import { Request, Response } from "express";
import { IRegisterRequest } from "./authentication.interface";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";


const registerUser = async (payload: IRegisterRequest) => {
    const { email, password, role } = payload;

    if(!email || !password || !role){
        throw new Error("Email, password and role are required")
    }
    const   newrole = role.toUpperCase()
    if(newrole === "ADMIN"){
        throw new Error("You cannot register as an admin")
    }
    if(newrole !== "TENANT" && newrole !== "LANDLORD") {
        throw new Error("Invalid role. Please specify either 'TENANT' or 'LANDLORD'")
    }

    const userTransaction = await prisma.$transaction( async (tx) =>{

        const isUserExist = await tx.user.findUnique({
            where: {
                email
            }
        })

        if(isUserExist){
            throw new Error("User already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: newrole
            },
            omit:{
                password: true
            }
        })

        return user
    })

        
    return userTransaction

}




export const authServices = {
    registerUser
}
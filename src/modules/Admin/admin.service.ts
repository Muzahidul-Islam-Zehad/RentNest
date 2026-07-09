import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        include: {
            profile: true,
        },
        omit:{
            password: true
        }

    });

    return users;
}

const updateUserStatus = async (userId: string, status: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }

    const newStatus = status.toUpperCase() as UserStatus;

    if(newStatus !== UserStatus.ACTIVE && newStatus !== UserStatus.BANNED) {
        throw new Error("Invalid user status");
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: newStatus,
        },
        omit: {
            password: true,
        },
    });

    return updatedUser;
}   

const getAllProperties = async () => {
    const properties = await prisma.property.findMany({
        include: {
            landlord: {
                omit: {
                    password: true,
                },
            },
            category: true,
            reviews: true,
        },
    });
    return properties;
}

const getAllRentalRequests = async () => {
    const rentalRequests = await prisma.rentalRequest.findMany({
        include: {
            property: true,
            tenant: {
                omit: {
                    password: true,
                },
            },
        },
    });
    return rentalRequests;
}


export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests
}
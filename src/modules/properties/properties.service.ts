import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError";
import httpStatus from "http-status";

const getAllProperties = async () => {
    const properties = await prisma.property.findMany(
        {
            include:{
                category: true,
                landlord: {
                    omit:{
                        password: true
                    },
                },
                reviews: true
            }
        }
    )

    if(!properties) {
        throw new AppError("No properties found", httpStatus.NOT_FOUND);
    }

    return properties;
}

const getPropertyById = async (propertyId: string) => {
    const property = await prisma.property.findUnique(
        {
            where:{
                id: propertyId
            },
            include:{
                category: true,
                landlord: {
                    omit:{
                        password: true
                    },
                },
                reviews: true
            }
        }
    )

    if(!property) {
        throw new AppError("Property not found", httpStatus.NOT_FOUND);
    }
    return property;
}

export const propertyServices = {
    getAllProperties,
    getPropertyById
}
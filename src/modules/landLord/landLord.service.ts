import { IPropertyListing } from "./landLord.interface";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";


const createPropertyListingInDB = async (payload: IPropertyListing, landlordId: string) => {
    const { title, description, location, city, price, categoryId, bedrooms, bathrooms, area, amenities, images } = payload;

    if (!title || !description || !location || !city || !price || !images) {
        throw new AppError("Missing required fields", httpStatus.BAD_REQUEST);
    }

    if (!landlordId) {
        throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    if (!categoryId) {
        throw new AppError("Category is required", httpStatus.BAD_REQUEST);
    }

    const newPropertyListing = await prisma.property.create(
        {
            data: {
                title,
                description,
                location,
                city,
                price,
                categoryId,
                landlordId,
                bedrooms,
                bathrooms,
                area,
                amenities: amenities ?? [],
                images,
            },
            include: {
                category: true,
                landlord: {
                    omit: {
                        password: true,
                    },
                },
            },
        }
    )

    return newPropertyListing;
}

const getAllPropertyListingsByLandlord = async (landlordId: string) => {
    if (!landlordId) {
        throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const listings = await prisma.property.findMany({
        where: {
            landlordId
        },
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true,
                },
            },
        },
    });

    return listings;
}

const updatePropertyListingInDB = async (propertyId: string, payload: Partial<IPropertyListing>, landlordId: string) => {
    if (!landlordId) {
        throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const updatedListing = await prisma.property.update({
        where: {
            id: propertyId,
            landlordId
        },
        data: payload
    });

    return updatedListing;
}

const getAllRequestsByTenant = async (landlordId: string) => {
    if (!landlordId) {
        throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const requests = await prisma.property.findMany({
        where: {
            landlordId,
            rentalRequests: {
                some: {}
            }
        },
        include: {
            rentalRequests: {
                include: {
                    tenant: {
                        omit: {
                            password: true,
                        },
                    },
                },
            },
        }
    })

    return requests;
}

export const landlordsService = {
    createPropertyListingInDB,
    getAllPropertyListingsByLandlord,
    updatePropertyListingInDB,
    getAllRequestsByTenant
}   

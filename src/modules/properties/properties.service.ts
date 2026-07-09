import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { PropertyFilters } from "./properties.interface";

// const getAllProperties = async () => {
//     const properties = await prisma.property.findMany(
//         {
//             include:{
//                 category: true,
//                 landlord: {
//                     omit:{
//                         password: true
//                     },
//                 },
//                 reviews: true
//             }
//         }
//     )

//     if(!properties) {
//         throw new AppError("No properties found", httpStatus.NOT_FOUND);
//     }

//     return properties;
// }
const getAllProperties = async (query: PropertyFilters) => {
    const {
        search,
        location,
        city,
        minPrice,
        maxPrice,
        category,
        amenities = []
    } = query;

    const where: any = {
        isAvailable: true,
        status: 'ACTIVE'
    };

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (location) {
        where.location = { contains: location, mode: 'insensitive' };
    }

    if (city) {
        where.city = { equals: city, mode: 'insensitive' };
    }

    if (minPrice) {
        where.price = { ...where.price, gte: Number(minPrice) };
    }

    if (maxPrice) {
        where.price = { ...where.price, lte: Number(maxPrice) };
    }

    if (category) {
        where.category = {
            name: { equals: category, mode: 'insensitive' }
        };
    }

    if (amenities.length > 0) {
        where.amenities = {
            hasEvery: amenities
        };
    }

    const properties = await prisma.property.findMany({
        where,
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true
                }
            },
            reviews: true
        },
        orderBy: [
            { createdAt: 'desc' },
            { price: 'asc' }
        ]
    });

    if (!properties || properties.length === 0) {
        throw new AppError("No properties found", httpStatus.NOT_FOUND);
    }

    return properties;
};

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
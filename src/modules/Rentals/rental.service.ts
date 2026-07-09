import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { RentalRequest } from "./rental.interface";
import { RentalStatus } from "../../../generated/prisma/enums";

const submitRentalRequestInDB = async (rentalData: RentalRequest) => {
    const { propertyId, tenantId, message, startDate, endDate } = rentalData;

    if (!propertyId || !tenantId || !startDate) {
        throw new AppError("Property, tenant and start date are required", httpStatus.BAD_REQUEST);
    }

    const requestTransaction = await prisma.$transaction(async (tx) => {
        const property = await tx.property.findUnique({
            where: {
                id: propertyId,
            },
        });

        if (!property) {
            throw new AppError("Property not found", httpStatus.NOT_FOUND);
        }

        if (property.landlordId === tenantId) {
            throw new AppError("You cannot submit a rental request for your own property", httpStatus.FORBIDDEN);
        }

        const existingRequest = await tx.rentalRequest.findFirst({
            where: {
                propertyId,
                tenantId,
                status: RentalStatus.PENDING,
            },
        });

        if (existingRequest) {
            throw new AppError("You already have a pending request for this property", httpStatus.CONFLICT);
        }

        const completedRequest = await tx.rentalRequest.findFirst({
            where: {
                propertyId,
                status: RentalStatus.COMPLETED,
            },
        });

        if (completedRequest) {
            throw new AppError("This property has already been rented", httpStatus.CONFLICT);
        }

        if (endDate && new Date(endDate) < new Date(startDate)) {
            throw new AppError("End date cannot be earlier than start date", httpStatus.BAD_REQUEST);
        }

        const rentalRequest = await tx.rentalRequest.create({
            data: {
                propertyId,
                tenantId,
                message,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined,
            },
            include: {
                property: true,
                tenant: {
                    omit: {
                        password: true,
                    },
                },
            },
        });

        return rentalRequest;
    });

    return requestTransaction;
};

const getRentalRequestsByTenantInDB = async (tenantId : string) => {
    const rentalRequests = await prisma.rentalRequest.findMany({
        where: {
            tenantId,
        },
        include: {
            property: true,
        },
    });

    return rentalRequests;
};

const getRentalRequestByIdInDB = async (requestId: string, tenantId: string) => {
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId,
            tenantId,
        },
        include: {
            property: true
        },
    });

    return rentalRequest;
};

export const rentalService = {
    submitRentalRequestInDB,
    getRentalRequestsByTenantInDB,
    getRentalRequestByIdInDB
};
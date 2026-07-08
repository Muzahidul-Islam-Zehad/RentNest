import { prisma } from "../../lib/prisma"


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
        
    return properties;
}

const getPropertyById = async (propertyId: string) => {

}

const getCategories = async () => {

}


export const propertyServices = {
    getAllProperties,
    getPropertyById,
    getCategories
}
import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError";
import { ICategories } from "./categories.interface";
import httpStatus from "http-status";


const createCategoriesInDB = async (categories: ICategories) => {
    const result = await prisma.category.create(
        {
            data: categories
        }
    )

    if(!result) {
        throw new AppError("Failed to create category", httpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
}

const getCategories = async () => {
    const categories = await prisma.category.findMany();
    if(!categories) {
        throw new AppError("No categories found", httpStatus.NOT_FOUND);
    }
    return categories;
}


export const categoriesService = {
    createCategoriesInDB,
    getCategories
}
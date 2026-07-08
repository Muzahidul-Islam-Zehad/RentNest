import { prisma } from "../../lib/prisma"
import { ICategories } from "./categories.interface";


const createCategoriesInDB = async (categories: ICategories) => {
    const result = await prisma.category.create(
        {
            data: categories
        }
    )
    return result;
}


export const categoriesService = {
    createCategoriesInDB
}
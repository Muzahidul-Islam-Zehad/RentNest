import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { categoriesService } from "./categories.service";
import { response } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { ICategories } from "./categories.interface";

const createCategories = catchAsync(
    async (req: Request, res: Response) => {
        const categories = req.body as ICategories;
        const result = await categoriesService.createCategoriesInDB(categories)
        response(res, {
            status: HttpStatus.CREATED,
            success: true,
            message: "Categories created successfully",
            data: result
        })
    }
)

const getCategories = catchAsync(
    async (req: Request, res: Response) => {
        const categories = await categoriesService.getCategories();
        response(res, {
            status: HttpStatus.OK,
            success: true,
            message: "Categories fetched successfully",
            data: categories
        });
    }
)


export const categoriesController = {
    createCategories,
    getCategories
}
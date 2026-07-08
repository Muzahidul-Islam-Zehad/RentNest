import { Router } from "express";
import { categoriesController } from "./categories.controller";
import { authMiddleware } from "../../middleware/authMiddleware";


const router= Router()

router.post("/",authMiddleware("ADMIN") , categoriesController.createCategories)
router.get("/", categoriesController.getCategories)

export const categoriesRouter = {
    router
}
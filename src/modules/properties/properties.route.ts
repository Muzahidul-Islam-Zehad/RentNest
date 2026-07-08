import { Router } from "express";
import { propertyController } from "./properties.controller";


const router = Router();


router.get('/', propertyController.getAllProperties)
router.get('/:id', propertyController.getPropertyById)
// router.get('/categorys', propertyController.getPropertiesByCategory)

export const propertyRouter = {
    router
}
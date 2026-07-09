import { Router } from "express";
import { rentalController } from "./rental.controller";
import { authMiddleware } from "../../middleware/authMiddleware";


const router = Router();


router.post('/:id', authMiddleware('TENANT') ,rentalController.submitRentalRequest);
router.get('/', authMiddleware('TENANT'), rentalController.getRentalRequestsByTenant);



export const rentalRouter = {
    router
};


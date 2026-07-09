import { Router } from "express";
import { rentalController } from "./rental.controller";
import { authMiddleware } from "../../middleware/authMiddleware";


const router = Router();


router.post('/:id', authMiddleware('TENANT') ,rentalController.submitRentalRequest);
router.get('/', authMiddleware('TENANT'), rentalController.getRentalRequestsByTenant);
router.get('/:id', authMiddleware('TENANT'), rentalController.getRentalRequestById);


export const rentalRouter = {
    router
};


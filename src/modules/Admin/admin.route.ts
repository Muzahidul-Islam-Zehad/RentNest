import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/authMiddleware";


const router = Router();


router.get('/users', authMiddleware("ADMIN"), adminController.getAllUsers);
router.patch('/users/:id/status', authMiddleware("ADMIN"), adminController.updateUserStatus);
router.get('/properties', authMiddleware("ADMIN"), adminController.getAllProperties);
router.get('/rental-requests', authMiddleware("ADMIN"), adminController.getAllRentalRequests);



export const adminRouter = {
    router,
};
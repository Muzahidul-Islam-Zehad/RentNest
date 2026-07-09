import { Router } from "express";
import { authController } from "./authentication.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/client";


const router = Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/me',authMiddleware("ADMIN","LANDLORD","TENANT"),authController.getCurrentUser)
router.patch('/me',authMiddleware("ADMIN","LANDLORD","TENANT"),authController.updateCurrentUser )


export const authRouter = {
    router
}
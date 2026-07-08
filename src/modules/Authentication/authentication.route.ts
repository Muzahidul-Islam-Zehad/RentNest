import { Router } from "express";
import { authController } from "./authentication.controller";


const router = Router()

router.post('/register', authController.registerUser)


export const authRouter = {
    router
}
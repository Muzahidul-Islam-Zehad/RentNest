import { Router } from "express";
import { landLordsController } from "./landLord.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router()


router.post("/properties", authMiddleware("ADMIN","LANDLORD") ,authMiddleware("LANDLORD"), landLordsController.createPropertyListing)


export const landlordsrouter = {
    router
}
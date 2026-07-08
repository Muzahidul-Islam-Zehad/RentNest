import { Router } from "express";
import { landLordsController } from "./landLord.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router()


router.post("/properties", authMiddleware("LANDLORD"), landLordsController.createPropertyListing)

router.get("/properties", authMiddleware("LANDLORD"), landLordsController.getAllPropertyListingsByLandlord)

router.put("/properties/:id", authMiddleware("LANDLORD"), landLordsController.updatePropertyListing)

router.get("/requests", authMiddleware("LANDLORD"), landLordsController.getAllRequestsByTenant)

router.patch("/requests/:id", authMiddleware("LANDLORD"), landLordsController.updateRequestStatus)

export const landlordsrouter = {
    router
}
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./modules/Authentication/authentication.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { propertyRouter } from "./modules/properties/properties.route";
import { landlordsrouter } from "./modules/landLord/landLord.route";
import { categoriesRouter } from "./modules/Categories/categories.route";
import { rentalRouter } from "./modules/Rentals/rentals.route";
import { reviewsRouter } from "./modules/Reviews/reviews.route";


const app: Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());


app.get('/', (req:Request, res: Response)=>{
    res.send("wellcome to the RentNest server");
})

app.use("/api/auth", authRouter.router)
app.use("/api/properties", propertyRouter.router)
app.use("/api/landlords", landlordsrouter.router)
app.use("/api/categories", categoriesRouter.router)
app.use("/api/rentals", rentalRouter.router)
app.use("/api/reviews", reviewsRouter.router)


app.use(globalErrorHandler);
export default app;

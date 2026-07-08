import express, { Application, Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./modules/Authentication/authentication.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import cookieParser from "cookie-parser";


const app: Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());


app.get('/', (req:Request, res: Response)=>{
    res.send("wellcome to the RentNest server");
})

app.use("/api/auth", authRouter.router)



app.use(globalErrorHandler);
export default app;

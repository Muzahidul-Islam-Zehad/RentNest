import express, { Application, Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./modules/Authentication/authentication.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";


const app: Application = express();

app.use(express.json());

app.get('/', (req:Request, res: Response)=>{
    res.send("wellcome to the RentNest server");
})

app.use("/api/auth", authRouter.router)



app.use(globalErrorHandler);
export default app;

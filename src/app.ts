import express, { Application, Request, Response } from "express";
import cors from "cors";


const app: Application = express();

app.use(express.json());

app.get('/', (req:Request, res: Response)=>{
    res.send("wellcome to the RentNest server");
})


export default app;

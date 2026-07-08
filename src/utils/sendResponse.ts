import { Response } from "express";

type Tmeta = {
    limit: number;
    page: number;
    total: number;
}

type Tresponse<T> = {
    status: number;
    message: string;
    data: T;
    meta?: Tmeta;
}


export const response = <T>(res: Response, data: Tresponse<T>) => {
    return res.status(data.status).json({
        message: data.message,
        data: data.data,
        meta: data.meta
    });
};
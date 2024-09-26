// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express,{Request, Response, NextFunction} from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import serverless from "serverless-http";
import app from '../../src/app'

const api = express();

api.use(express.json());
api.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};
api.use(cors(corsOptions));
api.options('*', cors(corsOptions));

api.use("/api/", app);

api.all("*",(req, res, next:NextFunction) =>{
    next( new Error(`Can't find ${req.originalUrl} on this server!`));
});

api.use((err:any ,req: Request, res: Response, next:NextFunction)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

export const handler = serverless(api);

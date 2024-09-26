// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express,{Request, Response, NextFunction} from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import serverless from "serverless-http";
import userRouter from '../../src/routes/userRoute'
import residencyRouter from '../../src/routes/residencyRoute'


const api = express();
const appRouter = express.Router()

api.use(express.json());
api.use(cookieParser());

const corsOptions = {
    origin: 'https://ks-casacenterl.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};
api.use(cors(corsOptions));
api.options('*', cors(corsOptions));

api.use("/api", appRouter);

appRouter.use('/user', userRouter)
appRouter.use('/residency', residencyRouter)


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

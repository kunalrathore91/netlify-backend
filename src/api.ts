import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import serverless from 'serverless-http'; // Import serverless-http

import userRouter from './routes/userRoute'
import residencyRouter from './routes/residencyRoute'

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'https://prisma-ks.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api/user', userRouter);
app.use('/api/residency', residencyRouter);

app.all("*", (req, res, next: NextFunction) => {
    next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

// Instead of app.listen, export the serverless handler
export const handler = serverless(app);

export  default app
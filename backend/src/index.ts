import 'dotenv/config';
import { APP_CONFIG } from '@/config/app.config.ts';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from 'cookie-session';
import connectDatabase from '@/config/database.config.ts';
import errorHandler from '@/middlewares/error-handler.middleware.ts';
import { HTTP_STATUS } from './config/http.config.ts';
import asyncHandler from './middlewares/async-handler.middleware.ts';
import { BadRequestException } from './utils/app-error.ts';
import { ErrorCodeEnum } from './enums/error-code.enum.ts';

const app = express();
const BASE_PATH = APP_CONFIG.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_CONFIG.FRONTEND_ORIGIN,
        credentials: true,
    })
);
app.use(
    session({
        name: 'session',
        keys: [APP_CONFIG.SESSION_SECRET],
        maxAge: Number(APP_CONFIG.SESSION_EXPIRES_IN),
        secure: APP_CONFIG.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
    })
);

app.get(
    '/api',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        throw new BadRequestException('This is a bad request', ErrorCodeEnum.VALIDATION_ERROR);
    })
);

app.get(
    '/api/hello',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        return res.status(HTTP_STATUS.OK).json({
            message: 'Hello World',
        });
    })
);

app.use(errorHandler);

app.listen(APP_CONFIG.PORT, async () => {
    console.log(`✅ Server is running on http://localhost:${APP_CONFIG.PORT}${BASE_PATH}`);
    await connectDatabase();
});

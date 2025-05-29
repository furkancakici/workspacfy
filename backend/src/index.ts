import 'dotenv/config';

import session from 'cookie-session';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import { APP_CONFIG } from '@/config/app.config';
import connectDatabase from '@/config/database.config';

import errorHandler from '@/middlewares/error-handler.middleware';

import { HTTP_STATUS } from './config/http.config';
import { ErrorCodeEnum } from './enums/error-code.enum';
import asyncHandler from './middlewares/async-handler.middleware';
import { BadRequestException, NotFoundException } from './utils/app-error';

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: APP_CONFIG.FRONTEND_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundException('Route not found', ErrorCodeEnum.RESOURCE_NOT_FOUND));
});

app.use(errorHandler);

app.listen(APP_CONFIG.PORT, async () => {
    console.log(`✅ Server is running on http://localhost:${APP_CONFIG.PORT}${APP_CONFIG.BASE_PATH}`);
    await connectDatabase();
});

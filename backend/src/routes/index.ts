import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { ErrorCodeEnum } from '@/enums/error-code.enum';

import asyncHandler from '@/middlewares/async-handler.middleware';

import authRoutes from '@/routes/auth.route';

import { NotFoundException } from '@/utils/app-error';

const routes = Router();

routes.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        res.status(HTTP_STATUS.OK).json({
            message: 'API is running!',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
        });
    })
);

routes.use('/auth', authRoutes);

export default routes;

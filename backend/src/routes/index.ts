import { Router } from 'express';
import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import asyncHandler from '@/middlewares/async-handler.middleware';

import authRoutes from '@/routes/auth.route';

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

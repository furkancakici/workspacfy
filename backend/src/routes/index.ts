import { Router } from 'express';
import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import asyncHandler from '@/middlewares/async-handler.middleware';

import authRouter from '@/routes/auth.route';
import userRouter from '@/routes/user.route';
import workspaceRouter from '@/routes/workspace.route';

const router = Router();

router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        res.status(HTTP_STATUS.OK).json({
            message: 'API is running!',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
        });
    })
);

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);

export default router;

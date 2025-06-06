import { Request, Response } from 'express';

import { APP_CONFIG } from '@/config/app.config';
import { HTTP_STATUS } from '@/config/http.config';

import { registerUserService } from '@/services/auth.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { registerSchema } from '@/validation/auth.validation';

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
        return res.redirect(`${APP_CONFIG.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    return res.redirect(`${APP_CONFIG.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
});

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    await registerUserService(body);

    res.status(HTTP_STATUS.CREATED).json({
        message: 'User registered successfully',
    });
});

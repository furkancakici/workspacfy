import { Request, Response } from 'express';

import { APP_CONFIG } from '@/config/app.config';

import asyncHandler from '@/middlewares/async-handler.middleware';

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
        return res.redirect(`${APP_CONFIG.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    return res.redirect(`${APP_CONFIG.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
});

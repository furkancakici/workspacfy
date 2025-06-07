import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { APP_CONFIG } from '@/config/app.config';
import { HTTP_STATUS } from '@/config/http.config';

import { registerUserService } from '@/services/auth.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { registerSchema } from '@/validation/auth.validation';

class AuthController {
    public googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
        const currentWorkspace = req.user?.currentWorkspace;

        if (!currentWorkspace) {
            return res.redirect(`${APP_CONFIG.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
        }

        return res.redirect(`${APP_CONFIG.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
    });

    public register = asyncHandler(async (req: Request, res: Response) => {
        const body = registerSchema.parse(req.body);

        await registerUserService(body);

        res.status(HTTP_STATUS.CREATED).json({
            message: 'User registered successfully',
        });
    });

    public login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error | null, user: Express.User, info: { message: string } | undefined) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: info?.message || 'Invalid email or password' });
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.status(HTTP_STATUS.OK).json({ message: 'Logged in successfully' });
            });
        });
    });
}

export const authController = new AuthController();

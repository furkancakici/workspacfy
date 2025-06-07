import { Router } from 'express';
import passport from 'passport';

import { APP_CONFIG } from '@/config/app.config';

import { googleLoginCallback, loginUserController, registerUserController } from '@/controllers/auth.controller';

const failedUrl = `${APP_CONFIG.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google-callback', passport.authenticate('google', { failureRedirect: failedUrl }), googleLoginCallback);

export default authRouter;

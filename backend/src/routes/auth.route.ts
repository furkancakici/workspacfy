import { Router } from 'express';
import passport from 'passport';

import { APP_CONFIG } from '@/config/app.config';

const failedUrl = `${APP_CONFIG.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoutes.get('/google-callback', passport.authenticate('google', { failureRedirect: failedUrl }), (req, res) => {
    res.redirect('/');
});

export default authRoutes;

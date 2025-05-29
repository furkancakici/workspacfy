import 'dotenv/config';

import session from 'cookie-session';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { APP_CONFIG } from '@/config/app.config';
import connectDatabase from '@/config/database.config';

import errorHandler from '@/middlewares/error-handler.middleware';

import apiRoutes from '@/routes';

const app = express();

app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: APP_CONFIG.NODE_ENV === 'production' ? 100 : 1000,
        message: 'Rate limit exceeded.',
    })
);
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
app.use(APP_CONFIG.BASE_PATH, apiRoutes);
app.use(errorHandler);

app.listen(APP_CONFIG.PORT, async () => {
    console.log(`✅ Server is running on http://localhost:${APP_CONFIG.PORT}${APP_CONFIG.BASE_PATH}`);
    await connectDatabase();
});

import { getEnv } from '@/utils/get-env';

const appConfig = () => ({
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    PORT: getEnv('PORT', '5001'),
    BASE_PATH: getEnv('BASE_PATH', '/api'),
    MONGO_URI: getEnv('MONGO_URI', ''),

    SESSION_SECRET: getEnv('SESSION_SECRET', 'your_secure_session_secret_key_here'),
    SESSION_EXPIRES_IN: getEnv('SESSION_EXPIRES_IN', '1d'),

    GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID', ''),
    GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET', ''),
    GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL', 'http://localhost:5677/api/auth/google-callback'),

    FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', 'http://localhost:3000'),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv('FRONTEND_GOOGLE_CALLBACK_URL', 'http://localhost:3000/auth/google-callback'),
});

export const APP_CONFIG = appConfig();

import mongoose from 'mongoose';

import { APP_CONFIG } from '@/config/app.config';

import logger from '@/utils/logger';

const connectDatabase = async () => {
    try {
        await mongoose.connect(APP_CONFIG.MONGO_URI);
        logger.info('✅ MongoDB connected successfully');
    } catch (error) {
        logger.error(
            {
                error: error instanceof Error ? error.message : 'Unknown error',
                mongoUri: APP_CONFIG.MONGO_URI.replace(/\/\/.*@/, '//*****@'), // Hide credentials
            },
            '❌ MongoDB connection failed'
        );
        await mongoose.disconnect();
        process.exit(1);
    }
};

export default connectDatabase;

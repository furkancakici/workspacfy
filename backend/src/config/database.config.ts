import mongoose from 'mongoose';

import { APP_CONFIG } from '@/config/app.config';

const connectDatabase = async () => {
    try {
        await mongoose.connect(APP_CONFIG.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error', error);
        mongoose.disconnect();
        process.exit(1);
    }
};

export default connectDatabase;

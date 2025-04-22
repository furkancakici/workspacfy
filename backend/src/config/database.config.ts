import mongoose from 'mongoose';
import config from '@/config/app.config.ts';

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error', error);
        mongoose.disconnect();
        process.exit(1);
    }
};

export default connectDatabase;

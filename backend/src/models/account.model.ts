import { ProviderEnum, ProviderEnumType } from '@/enums/account-provider.enum';
import mongoose, { Document, Schema } from 'mongoose';

export interface AccountDocument extends Document {
    provider: ProviderEnumType;
    providerId: string;
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
    tokenExpiry: Date | null;
    createdAt: Date;
}

const accountSchema = new Schema<AccountDocument>(
    {
        provider: { type: String, enum: Object.values(ProviderEnum), required: true },
        providerId: { type: String, unique: true, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        refreshToken: { type: String, default: null },
        tokenExpiry: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.refreshToken;
            },
        },
    }
);

const AccountModel = mongoose.model<AccountDocument>('Account', accountSchema);
export default AccountModel;

import mongoose, { Document, Schema, Types } from 'mongoose';

import { compareValue, hashValue } from '@/utils/bcrypt';

export interface UserDocument extends Document {
    name: string;
    email: string;
    password?: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: Types.ObjectId;
    comparePassword(value: string): Promise<boolean>;
    omitPassword(): Omit<UserDocument, 'password'>;
}

const userSchema = new Schema<UserDocument>(
    {
        name: { type: String, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, select: false },
        profilePicture: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: null },

        currentWorkspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        if (this.password) {
            this.password = await hashValue(this.password);
        }
    }
    next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return compareValue(password, this.password);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;

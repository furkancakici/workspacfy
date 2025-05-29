import mongoose, { Document, Schema, Types } from 'mongoose';

import { RolePermissionDocument } from '@/models/role-permission.model';

export interface MemberDocument extends Document {
    workspaceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: RolePermissionDocument;
    joinedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
    {
        workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: Types.ObjectId, ref: 'RolePermission', required: true },
        joinedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const MemberModel = mongoose.model<MemberDocument>('Member', memberSchema);
export default MemberModel;

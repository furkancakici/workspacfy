import { generateInviteCode } from '@/utils/uuid';
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface WorkspaceDocument extends Document {
    name: string;
    description: string;
    owner: Types.ObjectId;
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<WorkspaceDocument>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        inviteCode: { type: String, default: generateInviteCode, unique: true, required: true },
    },
    { timestamps: true }
);

workspaceSchema.methods.resetInviteCode = function () {
    this.inviteCode = generateInviteCode();
};

const WorkspaceModel = mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);
export default WorkspaceModel;

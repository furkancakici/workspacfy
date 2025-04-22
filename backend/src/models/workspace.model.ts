import { generateInviteCode } from '@/utils/uuid.ts';
import mongoose, { Document, Schema } from 'mongoose';

export interface WorkspaceDocument extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<WorkspaceDocument>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        inviteCode: { type: String, default: generateInviteCode, unique: true, required: true },
    },
    { timestamps: true }
);

workspaceSchema.methods.resetInviteCode = function () {
    this.inviteCode = generateInviteCode();
};

const WorkspaceModel = mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);
export default WorkspaceModel;

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ProjectDocument extends Document {
    name: string;
    description: string;
    emoji: string;
    workspace: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        emoji: { type: String, required: true, trim: true, default: '📝' },
        workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const ProjectModel = mongoose.model<ProjectDocument>('Project', projectSchema);
export default ProjectModel;

import mongoose, { Document, Schema } from 'mongoose';

export interface ProjectDocument extends Document {
    name: string;
    description: string;
    emoji: string;
    workspace: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        emoji: { type: String, required: true, trim: true, default: '📝' },
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const ProjectModel = mongoose.model<ProjectDocument>('Project', projectSchema);
export default ProjectModel;

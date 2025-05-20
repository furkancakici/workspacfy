import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum, TaskStatusEnumType } from '@/enums/task.enum';
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface TaskDocument extends Document {
    taskCode: string;
    title: string;
    description: string | null;
    project: Types.ObjectId;
    workspace: Types.ObjectId;
    status: TaskStatusEnumType;
    priority: TaskPriorityEnumType;
    assignedTo: Types.ObjectId | null;
    createdBy: Types.ObjectId;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
    {
        taskCode: { type: String, unique: true, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: null, trim: true },
        project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
        status: { type: String, enum: Object.values(TaskStatusEnum), default: TaskStatusEnum.TODO },
        priority: { type: String, enum: Object.values(TaskPriorityEnum), default: TaskPriorityEnum.MEDIUM },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        dueDate: { type: Date, default: null },
    },
    { timestamps: true }
);

const TaskModel = mongoose.model<TaskDocument>('Task', taskSchema);
export default TaskModel;

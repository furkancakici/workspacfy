import { z } from 'zod';

import { TaskPriorityEnum, TaskStatusEnum } from '@/enums/task.enum';

const titleSchema = z.string().trim().min(1, { message: 'Title is required' }).max(255, { message: 'Title must be less than 255 characters' });
const descriptionSchema = z.string().trim().optional();
const prioritySchema = z.enum(Object.values(TaskPriorityEnum) as [string, ...string[]]);
const statusSchema = z.enum(Object.values(TaskStatusEnum) as [string, ...string[]]);
const assignedToSchema = z.string().trim().min(1, { message: 'Assigned to is required' }).nullable();
const dueDateSchema = z
    .string()
    .optional()
    .transform((val, ctx) => {
        if (!val) return undefined;
        const date = new Date(val);
        if (isNaN(date.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid date format',
            });
            return z.NEVER;
        }
        return date;
    });
const taskIdSchema = z.string().trim().min(1, { message: 'Task ID is required' });

export const createTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema,
});

export type CreateTaskType = z.infer<typeof createTaskSchema>;
export type UpdateTaskType = z.infer<typeof updateTaskSchema>;

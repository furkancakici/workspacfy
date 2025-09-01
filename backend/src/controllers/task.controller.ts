import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { Permissions } from '@/enums/role.enum';
import { TaskPriorityEnumType, TaskStatusEnumType } from '@/enums/task.enum';

import { getMemberRoleInWorkspace } from '@/services/member.service';
import { createNewTask, deleteTaskById, getAllTasks, getTaskById, updateTaskById } from '@/services/task.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { projectIdSchema } from '@/validation/project.validation';
import { createTaskSchema, getTasksQuerySchema, taskIdSchema, updateTaskSchema } from '@/validation/task.validation';
import { workspaceIdSchema } from '@/validation/workspace.validation';

import { roleGuard } from '@/utils/role-guard';

class TaskController {
    public createNewTask = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const body = createTaskSchema.parse(req.body);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CREATE_TASK]);

        const { task } = await createNewTask(userId, workspaceId, projectId, body);

        res.status(HTTP_STATUS.CREATED).json({ message: 'Task created successfully', task });
    });

    public updateTaskById = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const taskId = taskIdSchema.parse(req.params.id);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const body = updateTaskSchema.parse(req.body);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_TASK]);

        const { updatedTask } = await updateTaskById(taskId, workspaceId, projectId, body);

        res.status(HTTP_STATUS.OK).json({ message: 'Task updated successfully', task: updatedTask });
    });

    public getAllTasks = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const validatedQuery = getTasksQuerySchema.parse(req.query);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const result = await getAllTasks(workspaceId, validatedQuery);

        res.status(HTTP_STATUS.OK).json({ message: 'Tasks fetched successfully', ...result });
    });

    public getTaskById = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const taskId = taskIdSchema.parse(req.params.id);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { task } = await getTaskById(taskId, workspaceId, projectId);

        res.status(HTTP_STATUS.OK).json({ message: 'Task fetched successfully', task });
    });

    public deleteTaskById = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const taskId = taskIdSchema.parse(req.params.id);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.DELETE_TASK]);

        await deleteTaskById(taskId, workspaceId, projectId);

        res.status(HTTP_STATUS.OK).json({ message: 'Task deleted successfully' });
    });
}

export const taskController = new TaskController();

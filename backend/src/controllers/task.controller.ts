import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { Permissions } from '@/enums/role.enum';

import { getMemberRoleInWorkspace } from '@/services/member.service';
import { createNewTask } from '@/services/task.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { projectIdSchema } from '@/validation/project.validation';
import { createTaskSchema } from '@/validation/task.validation';
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
}

export const taskController = new TaskController();

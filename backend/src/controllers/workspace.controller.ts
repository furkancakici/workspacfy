import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { Permissions } from '@/enums/role.enum';

import { getMemberRoleInWorkspace } from '@/services/member.service';
import { createNewWorkspace, getAllWorkspaces, getWorkspaceById, getWorkspaceMembers } from '@/services/workspace.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { createWorkspaceSchema, workspaceIdSchema } from '@/validation/workspace.validation';

import { roleGuard } from '@/utils/role-guard';

class WorkspaceController {
    public createNewWorkspace = asyncHandler(async (req: Request, res: Response) => {
        const body = createWorkspaceSchema.parse(req.body);

        const userId = req.user?._id;
        const workspace = await createNewWorkspace(userId, body);

        res.status(HTTP_STATUS.CREATED).json({ message: 'Workspace created successfully', workspace });
    });

    public getAllWorkspaces = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaces = await getAllWorkspaces(userId);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspaces fetched successfully', workspaces });
    });

    public getWorkspaceById = asyncHandler(async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        await getMemberRoleInWorkspace(userId, workspaceId);

        const { workspace } = await getWorkspaceById(userId, workspaceId);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspace fetched successfully', workspace });
    });

    public getWorkspaceMembers = asyncHandler(async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { members, roles } = await getWorkspaceMembers(workspaceId);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspace members fetched successfully', members, roles });
    });
}

export const workspaceController = new WorkspaceController();

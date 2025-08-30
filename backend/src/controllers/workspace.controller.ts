import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { Permissions } from '@/enums/role.enum';

import { getMemberRoleInWorkspace } from '@/services/member.service';
import {
    changeMemberRole,
    createNewWorkspace,
    deleteWorkspaceById,
    getAllWorkspaces,
    getWorkspaceAnalytics,
    getWorkspaceById,
    getWorkspaceMembers,
    updateWorkspaceById,
} from '@/services/workspace.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { changeRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from '@/validation/workspace.validation';

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

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { workspace } = await getWorkspaceById(workspaceId);

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

    public getWorkspaceAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await getWorkspaceAnalytics(workspaceId);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspace analytics fetched successfully', analytics });
    });

    public changeMemberRole = asyncHandler(async (req: Request, res: Response) => {
        const { roleId, memberId } = changeRoleSchema.parse(req.body);
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { member } = await changeMemberRole(workspaceId, memberId, roleId);

        res.status(HTTP_STATUS.OK).json({ message: 'Member role changed successfully', member });
    });

    public updateWorkspaceById = asyncHandler(async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const body = updateWorkspaceSchema.parse(req.body);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_WORKSPACE]);

        const { workspace } = await updateWorkspaceById(workspaceId, body);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspace updated successfully', workspace });
    });

    public deleteWorkspaceById = asyncHandler(async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.DELETE_WORKSPACE]);

        const { currentWorkspace } = await deleteWorkspaceById(workspaceId, userId);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspace deleted successfully', currentWorkspace });
    });
}

export const workspaceController = new WorkspaceController();

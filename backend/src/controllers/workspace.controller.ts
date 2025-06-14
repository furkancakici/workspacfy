import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { createNewWorkspaceService, getAllWorkspacesService } from '@/services/workspace.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { createWorkspaceSchema } from '@/validation/workspace.validation';

class WorkspaceController {
    public createNewWorkspace = asyncHandler(async (req: Request, res: Response) => {
        const body = createWorkspaceSchema.parse(req.body);

        const userId = req.user?._id;
        const workspace = await createNewWorkspaceService(userId, body);

        res.status(HTTP_STATUS.CREATED).json({ message: 'Workspace created successfully', workspace });
    });

    public getAllWorkspaces = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaces = await getAllWorkspacesService(userId);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspaces fetched successfully', workspaces });
    });
}

export const workspaceController = new WorkspaceController();

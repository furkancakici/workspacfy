import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { createNewWorkspaceService } from '@/services/workspace.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { createWorkspaceSchema } from '@/validation/workspace.validation';

class WorkspaceController {
    public createNewWorkspace = asyncHandler(async (req: Request, res: Response) => {
        const body = createWorkspaceSchema.parse(req.body);

        const userId = req.user?._id;
        const workspace = await createNewWorkspaceService(userId, body);

        res.status(HTTP_STATUS.CREATED).json({ message: 'Workspace created successfully', workspace });
    });
}

export const workspaceController = new WorkspaceController();

import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { getJoinWorkspaceByInvite } from '@/services/member.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { inviteCodeSchema } from '@/validation/workspace.validation';

class MemberController {
    public getJoinWorkspaceByInvite = asyncHandler(async (req: Request, res: Response) => {
        const inviteCode = inviteCodeSchema.parse(req.params.inviteCode);
        const userId = req.user?._id;

        const { workspaceId, role } = await getJoinWorkspaceByInvite(userId, inviteCode);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspace joined successfully', workspaceId, role });
    });
}

export const memberController = new MemberController();

import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { getJoinWorkspaceByInvite } from '@/services/member.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { inviteCodeSchema } from '@/validation/member.validation';

class MemberController {
    public getJoinWorkspaceByInvite = asyncHandler(async (req: Request, res: Response) => {
        const body = inviteCodeSchema.parse(req.body);
        const userId = req.user?._id;

        const { workspaceId, role } = await getJoinWorkspaceByInvite(userId, body);

        res.status(HTTP_STATUS.OK).json({ message: 'Workspace joined successfully', workspaceId, role });
    });
}

export const memberController = new MemberController();

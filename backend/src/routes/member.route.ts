import { Router } from 'express';

import { memberController } from '@/controllers/member.controller';

const memberRouter = Router();

memberRouter.post('/join-workspace', memberController.getJoinWorkspaceByInvite);

export default memberRouter;

import { Router } from 'express';

import { workspaceController } from '@/controllers/workspace.controller';

const workspaceRouter = Router();

workspaceRouter.post('/create/new', workspaceController.createNewWorkspace);

export default workspaceRouter;

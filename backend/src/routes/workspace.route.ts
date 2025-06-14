import { Router } from 'express';

import { workspaceController } from '@/controllers/workspace.controller';

import authenticateCheck from '@/middlewares/authenticate-check.middleware';

const workspaceRouter = Router();

workspaceRouter.post('/create/new', authenticateCheck, workspaceController.createNewWorkspace);
workspaceRouter.get('/all', authenticateCheck, workspaceController.getAllWorkspaces);

export default workspaceRouter;

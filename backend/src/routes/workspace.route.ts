import { Router } from 'express';

import { workspaceController } from '@/controllers/workspace.controller';

import authenticateCheck from '@/middlewares/authenticate-check.middleware';

const workspaceRouter = Router();

workspaceRouter.post('/create/new', workspaceController.createNewWorkspace);
workspaceRouter.get('/all', workspaceController.getAllWorkspaces);
workspaceRouter.get('/:id', workspaceController.getWorkspaceById);
workspaceRouter.get('/members/:id', workspaceController.getWorkspaceMembers);
workspaceRouter.get('/analytics/:id', workspaceController.getWorkspaceAnalytics);
workspaceRouter.put('/member-role/:id', workspaceController.changeMemberRole);

export default workspaceRouter;

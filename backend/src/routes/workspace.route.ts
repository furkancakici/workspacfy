import { Router } from 'express';

import { workspaceController } from '@/controllers/workspace.controller';

const workspaceRouter = Router();

workspaceRouter.post('/create/new', workspaceController.createNewWorkspace);
workspaceRouter.put('/update/:id', workspaceController.updateWorkspaceById);
workspaceRouter.delete('/delete/:id', workspaceController.deleteWorkspaceById);
workspaceRouter.get('/all', workspaceController.getAllWorkspaces);
workspaceRouter.get('/:id', workspaceController.getWorkspaceById);
workspaceRouter.get('/members/:id', workspaceController.getWorkspaceMembers);
workspaceRouter.get('/analytics/:id', workspaceController.getWorkspaceAnalytics);
workspaceRouter.put('/member-role/:id', workspaceController.changeMemberRole);

export default workspaceRouter;

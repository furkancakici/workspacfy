import { Router } from 'express';

import { projectController } from '@/controllers/project.controller';

const projectRouter = Router();

projectRouter.post('/workspace/:workspaceId/create', projectController.createNewProject);
projectRouter.get('/workspace/:workspaceId/all', projectController.getAllProjects);
projectRouter.get('/:projectId/workspace/:workspaceId', projectController.getSingleProject);
projectRouter.get('/:projectId/workspace/:workspaceId/analytics', projectController.getProjectAnalytics);

export default projectRouter;

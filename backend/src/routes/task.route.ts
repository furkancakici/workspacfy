import { Router } from 'express';

import { taskController } from '@/controllers/task.controller';

const taskRouter = Router();

taskRouter.post('/project/:projectId/workspace/:workspaceId/create', taskController.createNewTask);

export default taskRouter;

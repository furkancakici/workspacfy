import { Router } from 'express';

import { taskController } from '@/controllers/task.controller';

const taskRouter = Router();

taskRouter.post('/project/:projectId/workspace/:workspaceId/create', taskController.createNewTask);
taskRouter.put('/:id/project/:projectId/workspace/:workspaceId/update', taskController.updateTaskById);
taskRouter.get('/workspace/:workspaceId/all', taskController.getAllTasks);

export default taskRouter;

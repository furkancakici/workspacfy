import { Router } from 'express';

import { taskController } from '@/controllers/task.controller';

const taskRouter = Router();

taskRouter.post('/project/:projectId/workspace/:workspaceId/create', taskController.createNewTask);
taskRouter.put('/:id/project/:projectId/workspace/:workspaceId/update', taskController.updateTaskById);
taskRouter.get('/workspace/:workspaceId/all', taskController.getAllTasks);
taskRouter.get('/:id/project/:projectId/workspace/:workspaceId/detail', taskController.getTaskById);
taskRouter.delete('/:id/project/:projectId/workspace/:workspaceId/delete', taskController.deleteTaskById);

export default taskRouter;

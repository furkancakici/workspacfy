import { Router } from 'express';

import { userController } from '@/controllers/user.controller';

import authenticateCheck from '@/middlewares/authenticate-check.middleware';

const userRouter = Router();

userRouter.get('/current', authenticateCheck, userController.getCurrentUser);

export default userRouter;

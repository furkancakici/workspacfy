import { Router } from 'express';

import { userController } from '@/controllers/user.controller';

import authanticatedCheck from '@/middlewares/authanticated-check.middleware';

const userRouter = Router();

userRouter.get('/current', authanticatedCheck, userController.getCurrentUser);

export default userRouter;

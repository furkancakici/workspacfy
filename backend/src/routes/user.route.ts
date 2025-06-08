import { Router } from 'express';

import { userController } from '@/controllers/user.controller';

import authanticatedCheckMiddleware from '@/middlewares/authanticated-check.middleware';

const userRouter = Router();

userRouter.get('/current', authanticatedCheckMiddleware, userController.getCurrentUser);

export default userRouter;

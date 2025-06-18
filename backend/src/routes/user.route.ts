import { Router } from 'express';

import { userController } from '@/controllers/user.controller';

const userRouter = Router();

userRouter.get('/current', userController.getCurrentUser);

export default userRouter;

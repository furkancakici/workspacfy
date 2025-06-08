import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { getCurrentUserService } from '@/services/user.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

class UserController {
    public getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await getCurrentUserService(req.user?._id);
        res.status(HTTP_STATUS.OK).json({ message: 'User fetched successfully', user });
    });
}

export const userController = new UserController();

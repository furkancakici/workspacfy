import { NextFunction, Request, Response } from 'express';

import { UnauthorizedException } from '@/utils/app-error';

const authanticatedCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) {
        throw new UnauthorizedException();
    }
    next();
};

export default authanticatedCheckMiddleware;

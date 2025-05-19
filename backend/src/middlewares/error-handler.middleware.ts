import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '@/config/http.config';
import { AppError } from '@/utils/app-error';

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction): any => {
    console.error(`Error Occurred on PATH: ${req.path}`, err);

    if (err instanceof SyntaxError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: 'Invalid JSON Format, Please check your request body',
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode,
        });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: err.message || 'Unknown Error Occurred',
    });
};

export default errorHandler;

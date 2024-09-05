import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';
const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            error: {
                statusCode: err.statusCode,
                isOperational: err.isOperational,
            }
        });
    }

    // For unhandled errors, return a generic 500 server error
    return res.status(500).json({
        message: 'Server error',
        error: {
            statusCode: 500,
            isOperational: false,
        }
    });
};

export default { errorHandler };

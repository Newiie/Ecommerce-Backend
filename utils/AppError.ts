class AppError extends Error {
    public readonly status: number;
    public readonly isOperational: boolean;

    constructor(message: string, status = 500, isOperational = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;

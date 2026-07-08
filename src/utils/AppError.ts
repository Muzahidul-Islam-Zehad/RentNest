class AppError extends Error {
    statusCode: number;
    status: number;

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.status = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export default AppError;

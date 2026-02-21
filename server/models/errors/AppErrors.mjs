export function AppError(message, description) {
    this.description = description;
    this.message = message;
}

export class UnauthorizedError extends AppError {
    constructor(message){
        super('Unauthorized', message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message){
        super('Forbidden', message);
    }
}

export class NotFoundError extends AppError {
    constructor(message){
        super('Not Found', message);
    }
}

export class ConflictError extends AppError {
    constructor(message){
        super('Conflict', message);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message){
        super('Unprocessable Entity', message);
    }
}

export class InternalServerError extends AppError {
    constructor(message){
        super('Internal Server Error', message);
    }
}
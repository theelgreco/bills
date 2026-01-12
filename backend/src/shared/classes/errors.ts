export abstract class ResponseError extends Error {
    public status: number;

    constructor(name: string, status: number, message: string) {
        super(message);
        this.name = name;
        this.status = status;
    }

    response(message: string = this.message) {
        return {
            name: this.name,
            message,
        };
    }
}

export class UnauthorizedError extends ResponseError {
    constructor(message = "You are not authorized") {
        super("UnauthorizedError", 403, message);
    }
}

export class NotFoundError extends ResponseError {
    constructor(message = "Not found") {
        super("NotFoundError", 404, message);
    }
}

export class BadRequestError extends ResponseError {
    constructor(message = "Bad request") {
        super("BadRequestError", 400, message);
    }
}

export class UniqueError extends ResponseError {
    constructor(message = "Already exists") {
        super("UniqueError", 400, message);
    }
}

export class WrongPasswordError extends ResponseError {
    constructor(message = "Wrong password") {
        super("WrongPasswordError", 400, message);
    }
}

export class InternalServerError extends ResponseError {
    constructor(message = "An error occurred on the server") {
        super("InternalServerError", 500, message);
    }
}

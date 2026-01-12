export class ResponseError extends Error {
    name: string = "";
    status: number = 0;
    message: string = "";

    response(message: string = this.message): { name: string; message: string } {
        return {
            name: this.name,
            message,
        };
    }
}

export class UnauthorizedError extends ResponseError {
    name = "UnauthorizedError";
    status = 403;
    message = "You are not authorized";
}

export class NotFoundError extends ResponseError {
    name = "NotFoundError";
    status = 404;
    message = "Not found";
}

export class UniqueError extends ResponseError {
    name = "UniqueError";
    status = 400;
    message = "Already exists";
}

export class WrongPasswordError extends ResponseError {
    name = "WrongPasswordError";
    status = 400;
    message = "Wrong password";
}

export class InternalServerError extends ResponseError {
    name = "InternalServerError";
    status = 500;
    message = "An error occurred on the server";
}

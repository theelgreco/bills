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

export class InternalServerError extends Error {
    name = "InternalServerError";
    status = 500;
    message = "An error occurred on the server";
}

export class ResponseError {
    name: string = "";
    message: string = "";

    constructor({ name, message }: { name: string; message: string }) {
        this.name = name;
        this.message = message;
    }
}

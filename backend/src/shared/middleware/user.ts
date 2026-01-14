import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../classes/errors.js";
import { getPerson } from "../../features/people/models.js";
import type { Socket } from "socket.io";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        req.user = await getPerson(req.headers["x-user-id"] as string);
        next();
    } catch {
        throw new UnauthorizedError();
    }
}

export async function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
    try {
        socket.user = await getPerson(socket.handshake.auth["x-user-id"] as string);
        next();
    } catch {
        next(new UnauthorizedError());
    }
}

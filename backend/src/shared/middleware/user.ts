import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../classes/errors";

export function handleAuthorization(req: Request, res: Response, next: NextFunction) {
    if (!req.headers["x-user"]) {
        next(new UnauthorizedError());
    } else {
        next();
    }
}

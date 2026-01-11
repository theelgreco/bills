import type { Request, Response, NextFunction } from "express";
import { ResponseError, UnauthorizedError } from "../classes/errors";

export function handleAppErrors(err: ResponseError, req: Request, res: Response, next: NextFunction) {
    console.error(`${new Date().toISOString()}: ${err.status} | ${err.name} | ${err.message}`);

    if (err instanceof UnauthorizedError) {
        res.status(403).send(err.response());
    } else {
        res.status(500).send(err.response());
    }
}

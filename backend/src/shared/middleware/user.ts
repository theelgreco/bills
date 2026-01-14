import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../classes/errors.js";
import { getPerson } from "../../features/people/models.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        req.user = await getPerson(req.headers["x-user-id"] as string);
        next();
    } catch {
        throw new UnauthorizedError();
    }
}

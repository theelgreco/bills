import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../classes/errors";
import { getPerson } from "../../features/people/models";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers["x-user-id"];

    if (!userId) {
        throw new UnauthorizedError();
    } else {
        req.user = await getPerson(userId as string);
        next();
    }
}

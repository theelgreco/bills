import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../shared/classes/errors";

export async function hasFamily(req: Request, _res: Response, next: NextFunction) {
    if (req.user.familyId === null) throw new BadRequestError("You don't have a family");
    next();
}

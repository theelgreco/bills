import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../shared/classes/errors.js";
import { getFamily } from "./models.js";

export async function hasFamily(req: Request, _res: Response, next: NextFunction) {
    if (req.user.familyId === null) throw new BadRequestError("You don't have a family");
    getFamily(req.user.familyId); // Try to get the family. Throws if it doesn't exist
    next();
}

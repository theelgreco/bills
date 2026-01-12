import type { Request, Response } from "express";
import { PostFamiliesPostData } from "./schemas";
import { createNewFamily, getFamilyWithMembers, insertNewFamilyMember } from "./models";
import { BadRequestError, ForbiddenError } from "../../shared/classes/errors";

/**
 * Get family data
 */
export async function getFamily(req: Request, res: Response) {
    const familyId = req.params.id as string;

    if (req.user.familyId !== familyId) throw new ForbiddenError("You don't have access to this family");

    const family = await getFamilyWithMembers(familyId);
    return res.status(200).send(family);
}

/**
 * Creates a new family
 */
export async function postFamilies(req: Request, res: Response) {
    if (req.user.familyId) throw new BadRequestError("You already have a family");

    const postData = PostFamiliesPostData.parse(req.body);
    const family = await createNewFamily(postData, req.user.id);
    res.status(200).send(family);
}

/**
 * Join a family
 */
export async function postFamilyJoin(req: Request, res: Response) {
    const familyId = req.params.id as string;

    if (req.user.familyId === familyId) throw new BadRequestError("You're already in this family");
    else if (req.user.familyId !== null) throw new BadRequestError("You already have a family. You can't join another one!");

    const family = await insertNewFamilyMember(familyId, req.user.id);
    res.status(200).send(family);
}

import type { Request, Response } from "express";
import { PostFamiliesPostData } from "./schemas";
import { createNewFamily, insertNewFamilyMember } from "./models";
import { BadRequestError } from "../../shared/classes/errors";

export async function postFamilies(req: Request, res: Response) {
    if (req.user.familyId) throw new BadRequestError("You already have a family");

    const postData = PostFamiliesPostData.parse(req.body);
    const family = await createNewFamily(postData, req.user.id);
    res.status(200).send(family);
}

export async function postFamilyJoin(req: Request, res: Response) {
    if (req.user.familyId) throw new BadRequestError("You already have a family");

    const familyId = req.params.id as string;
    const family = await insertNewFamilyMember(familyId, req.user.id);
    res.status(200).send(family);
}

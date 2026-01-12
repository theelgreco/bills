import type { Request, Response } from "express";
import { PostFamiliesPostData } from "./schemas";
import { createNewFamily } from "./models";
import { BadRequestError } from "../../shared/classes/errors";

export async function postFamilies(req: Request, res: Response) {
    if (req.user.familyId) throw new BadRequestError("You already have a family");

    const postData = PostFamiliesPostData.parse(req.body);
    const family = await createNewFamily(postData, req.user.id);
    res.status(200).send(family);
}

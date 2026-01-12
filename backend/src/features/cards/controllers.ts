import type { Request, Response } from "express";
import { getCardAndOwner, getCardAndOwnerAndFamily, getFamilyCardsAndOwner, insertCard, removeCard, updateCard } from "./models";
import { PostCardPostDataSchema, PutCardDataSchema } from "./schemas";
import { ForbiddenError } from "../../shared/classes/errors";

/** Get all family cards */
export async function getCards(req: Request, res: Response) {
    const familyId = req.user.familyId as string;
    const cards = getFamilyCardsAndOwner(familyId);

    res.status(200).send(cards);
}

/** Create a new card */
export async function postCards(req: Request, res: Response) {
    const ownerId = req.user.id as string;
    const postData = PostCardPostDataSchema.parse(req.body);
    const newCard = await insertCard({ ...postData, ownerId });
    const formattedCard = await getCardAndOwner(newCard.id);

    return res.status(200).send(formattedCard);
}

/** Update a card */
export async function putCard(req: Request, res: Response) {
    const familyId = req.user.familyId as string;
    const cardId = req.params.id as string;

    const card = await getCardAndOwnerAndFamily(cardId);
    if (card.owner.familyId !== familyId) throw new ForbiddenError("You don't have permission to edit this card");

    const postData = PutCardDataSchema.parse(req.body);
    const updatedCard = await updateCard(cardId, postData);
    const formattedCard = await getCardAndOwner(updatedCard.id);

    return res.status(200).send(formattedCard);
}

/** Delete a card */
export async function deleteCard(req: Request, res: Response) {
    const familyId = req.user.familyId as string;
    const cardId = req.params.id as string;

    const card = await getCardAndOwnerAndFamily(cardId);
    if (card.owner.familyId !== familyId) throw new ForbiddenError("You don't have permission to delete this card");

    await removeCard(cardId);

    return res.status(204).send();
}

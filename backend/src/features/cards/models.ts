import { prisma } from "../../shared/lib/prisma";
import { PostCardPostData, PutCardData } from "./schemas";

export async function getCardAndOwnerAndFamily(cardId: string) {
    return await prisma.card.findFirstOrThrow({
        where: { id: cardId },
        include: { owner: { include: { family: true } } },
    });
}

export async function getCardAndOwner(cardId: string) {
    return await prisma.card.findFirstOrThrow({
        where: { id: cardId },
        omit: { ownerId: true },
        include: {
            owner: { omit: { password: true, familyId: true } },
        },
    });
}

export async function getFamilyCardsAndOwner(familyId: string) {
    return await prisma.card.findMany({
        where: { owner: { familyId } },
        orderBy: { createdAt: "desc" },
        omit: { ownerId: true },
        include: {
            owner: { omit: { password: true, familyId: true } },
        },
    });
}

export async function insertCard(data: PostCardPostData & { ownerId: string }) {
    return await prisma.card.create({ data });
}

export async function updateCard(cardId: string, data: PutCardData) {
    return prisma.card.update({ where: { id: cardId }, data });
}

export async function removeCard(cardId: string) {
    return await prisma.card.delete({ where: { id: cardId } });
}

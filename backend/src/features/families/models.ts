import { prisma } from "../../shared/lib/prisma.js";
import { PostFamilies } from "./schemas.js";

export async function getFamily(familyId: string) {
    return await prisma.family.findUniqueOrThrow({ where: { id: familyId } });
}

export async function getFamilyWithMembers(familyId: string) {
    return await prisma.family.findUniqueOrThrow({
        where: { id: familyId },
        include: {
            members: { orderBy: { createdAt: "desc" }, omit: { password: true, familyId: true } },
        },
    });
}

export async function createNewFamily(data: PostFamilies, userId: string) {
    return await prisma.family.create({ data: { ...data, members: { connect: { id: userId } } } });
}

export async function insertNewFamilyMember(familyId: string, userId: string) {
    return await prisma.family.update({ where: { id: familyId }, data: { members: { connect: { id: userId } } } });
}

import { prisma } from "../../shared/lib/prisma";
import { PostFamilies } from "./schemas";

export async function createNewFamily(data: PostFamilies, userId: string) {
    return await prisma.family.create({ data: { ...data, members: { connect: { id: userId } } } });
}

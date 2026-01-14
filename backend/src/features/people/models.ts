import { prisma } from "../../shared/lib/prisma.js";

export async function getPerson(id: string) {
    return await prisma.person.findUniqueOrThrow({ where: { id } });
}

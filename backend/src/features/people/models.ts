import { prisma } from "../../shared/lib/prisma";

export async function getPerson(id: string) {
    return await prisma.person.findUniqueOrThrow({ where: { id } });
}

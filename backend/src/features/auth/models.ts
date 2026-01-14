import { prisma } from "../../shared/lib/prisma.js";
import type { LoginPostData, RegisterPostData } from "./schemas.js";

export async function createNewUser(data: RegisterPostData) {
    return await prisma.person.create({ data });
}

export async function getUser(data: Pick<LoginPostData, "username">) {
    return await prisma.person.findUniqueOrThrow({ where: { username: data.username } });
}

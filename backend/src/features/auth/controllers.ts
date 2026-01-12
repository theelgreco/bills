import type { Request, Response } from "express";
import { LoginPostDataSchema, RegisterPostDataSchema } from "./schemas";
import { createNewUser, getUser } from "./models";
import { checkPassword, hashPassword } from "../../shared/lib/password";

export async function register(req: Request, res: Response) {
    const postData = RegisterPostDataSchema.parse(req.body);
    const user = await createNewUser({ ...postData, password: await hashPassword(postData.password) });
    const { password, ...userWithoutPassword } = user; // Remove password from response
    return res.status(200).send(userWithoutPassword);
}

export async function login(req: Request, res: Response) {
    const postData = LoginPostDataSchema.parse(req.body);
    const user = await getUser({ username: postData.username });
    await checkPassword(postData.password, user.password);
    const { password, ...userWithoutPassword } = user; // Remove password from response
    return res.status(200).send(userWithoutPassword);
}

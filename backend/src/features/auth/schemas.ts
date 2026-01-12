import z from "zod";

export const RegisterPostDataSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
    name: z.string(),
    image: z.string(),
});

export type RegisterPostData = z.infer<typeof RegisterPostDataSchema>;

export const LoginPostDataSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginPostData = z.infer<typeof LoginPostDataSchema>;

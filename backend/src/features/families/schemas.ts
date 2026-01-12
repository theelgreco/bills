import z from "zod";

export const PostFamiliesPostData = z.object({
    name: z.string().min(1),
});

export type PostFamilies = z.infer<typeof PostFamiliesPostData>;

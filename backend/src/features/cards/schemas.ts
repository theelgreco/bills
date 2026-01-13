import z from "zod";

export const PostCardPostDataSchema = z.object({
    name: z.string().min(1),
    lastFourDigits: z.string().min(4).max(4),
    sortCode: z.string().min(6),
    accountNumber: z.string().min(8),
    ownerId: z.string(),
});
export type PostCardPostData = z.infer<typeof PostCardPostDataSchema>;

export const PutCardDataSchema = PostCardPostDataSchema;
export type PutCardData = z.infer<typeof PutCardDataSchema>;

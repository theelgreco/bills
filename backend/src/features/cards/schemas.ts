import z from "zod";

export const PostCardPostDataSchema = z.object({
    name: z.string(),
    lastFourDigits: z.number().min(1000),
    sortCode: z.number().min(100000),
    accountNumber: z.number().min(10000000),
});
export type PostCardPostData = z.infer<typeof PostCardPostDataSchema>;

export const PutCardDataSchema = PostCardPostDataSchema;
export type PutCardData = z.infer<typeof PutCardDataSchema>;

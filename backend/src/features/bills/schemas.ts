import z from "zod";

export const PostBillsPostDataSchema = z.object({
    name: z.string().min(1),
    totalAmountPence: z.number().min(1),
    paymentDay: z.number().min(1).max(31),
    transferDay: z.number().min(1).max(31),
    cardId: z.string(),
});
export type PostBillsPostData = z.infer<typeof PostBillsPostDataSchema>;

// The request body for 'putting' a bill takes the same data as the post method
export const PutBillDataSchema = PostBillsPostDataSchema;
export type PutBillsData = z.infer<typeof PutBillDataSchema>;

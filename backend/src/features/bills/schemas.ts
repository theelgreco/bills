import z from "zod";

export const PostBillsPostDataSchema = z.object({
    name: z.string().min(1),
    totalAmountPence: z.number().min(1),
    paymentDay: z.number().min(1).max(31),
    transferDay: z.number().min(1).max(31),
    cardId: z.string().nullable(),
});
export type PostBillsPostData = z.infer<typeof PostBillsPostDataSchema>;

// The request body for 'putting' a bill takes the same data as the post method
export const PutBillDataSchema = PostBillsPostDataSchema;
export type PutBillsData = z.infer<typeof PutBillDataSchema>;

export const PostBillPaymentsDataSchema = z.object({
    amountPence: z.number().min(1),
    payerId: z.string(),
});
export type PostBillPaymentsData = z.infer<typeof PostBillPaymentsDataSchema>;

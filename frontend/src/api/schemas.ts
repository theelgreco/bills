import z from "zod";

export const UserSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.string(),
    familyId: z.string().nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const FamilyMemberSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.string(),
});
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

export const FamilySchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    name: z.string(),
    members: z.array(FamilyMemberSchema),
});
export type Family = z.infer<typeof FamilySchema>;

export const BankCardSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    name: z.string(),
    lastFourDigits: z.number(),
    sortCode: z.number(),
    accountNumber: z.number(),
    owner: FamilyMemberSchema,
});
export type BankCard = z.infer<typeof BankCardSchema>;

export const BillPaymentSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    amountPence: z.number(),
    payer: FamilyMemberSchema,
});
export type BillPayment = z.infer<typeof BillPaymentSchema>;

export const BillSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    name: z.string(),
    totalAmountPence: z.number(),
    paymentDay: z.number(),
    transferDay: z.number(),
    card: BankCardSchema.nullable(),
    payments: z.array(BillPaymentSchema),
});
export type Bill = z.infer<typeof BillSchema>;

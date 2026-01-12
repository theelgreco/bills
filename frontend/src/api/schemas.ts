import z from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.string(),
    familyId: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const FamilyMemberSchema = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.string(),
});
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

export const FamilySchema = z.object({
    id: z.string(),
    name: z.string(),
    members: z.array(FamilyMemberSchema),
});
export type Family = z.infer<typeof FamilySchema>;

export const BankCardSchema = z.object({
    id: z.string(),
    name: z.string(),
    lastFourDigits: z.number(),
    sortCode: z.number(),
    accountNumber: z.number(),
    owner: z.object({
        id: z.string(),
        name: z.string(),
    }),
});
export type BankCard = z.infer<typeof BankCardSchema>;

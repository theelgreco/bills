import { prisma } from "../../shared/lib/prisma";
import { PostBillPaymentsData, PostBillsPostData, PutBillsData } from "./schemas";

export async function getBill(billId: string) {
    return prisma.bill.findUniqueOrThrow({
        where: { id: billId },
    });
}

export async function getBillWithCardAndOwner(billId: string) {
    return prisma.bill.findUniqueOrThrow({
        where: { id: billId },
        omit: { familyId: true, cardId: true },
        include: {
            card: {
                omit: { ownerId: true },
                include: {
                    owner: {
                        omit: { password: true, familyId: true },
                    },
                },
            },
            payments: {
                omit: { billId: true, payerId: true },
                include: {
                    payer: { omit: { password: true, familyId: true } },
                },
            },
        },
    });
}

export async function getFamilyBillsWithCardAndOwner(familyId: string) {
    return prisma.bill.findMany({
        where: { familyId },
        omit: { familyId: true, cardId: true },
        include: {
            card: {
                omit: { ownerId: true },
                include: {
                    owner: {
                        omit: { password: true, familyId: true },
                    },
                },
            },
            payments: {
                omit: { billId: true, payerId: true },
                include: {
                    payer: { omit: { password: true, familyId: true } },
                },
            },
        },
    });
}

export async function insertBill(data: PostBillsPostData & { familyId: string }) {
    return await prisma.bill.create({ data });
}

export async function updateBill(billId: string, data: PutBillsData) {
    return prisma.bill.update({ where: { id: billId }, data });
}

export async function removeBill(billId: string) {
    return prisma.bill.delete({ where: { id: billId } });
}

export async function insertBillPayment(data: PostBillPaymentsData & { billId: string; payerId: string }) {
    return await prisma.billPayment.create({ data });
}

export async function removeBillPayment(billPaymentId: string) {
    return await prisma.billPayment.delete({ where: { id: billPaymentId } });
}

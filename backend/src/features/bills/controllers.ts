import type { Request, Response } from "express";
import { PostBillPaymentsDataSchema, PostBillsPostDataSchema, PutBillDataSchema } from "./schemas.js";
import {
    getBill,
    getBillWithCardAndOwner,
    getFamilyBillsWithCardAndOwner,
    insertBill,
    insertBillPayment,
    removeBill,
    removeBillPayment,
    updateBill,
} from "./models.js";
import { ForbiddenError } from "../../shared/classes/errors.js";

/** Get all family bills */
export async function getBills(req: Request, res: Response) {
    const familyId = req.user.familyId as string;
    const bills = await getFamilyBillsWithCardAndOwner(familyId);
    return res.status(200).send(bills);
}

/** Create a new bill */
export async function postBills(req: Request, res: Response) {
    const postData = PostBillsPostDataSchema.parse(req.body);
    const createdBill = await insertBill({ ...postData, familyId: req.user.familyId as string });
    const bill = await getBillWithCardAndOwner(createdBill.id); // Get the newly created bill in the desired format (with card and owner)
    return res.status(200).send(bill);
}

/** Update a bill */
export async function putBill(req: Request, res: Response) {
    const billId = req.params.id as string;
    const bill = await getBill(billId);
    const familyId = req.user.familyId as string;

    if (bill.familyId !== familyId) throw new ForbiddenError("You don't have permission to edit this bill");

    const postData = PutBillDataSchema.parse(req.body);
    const updatedBill = await updateBill(billId, postData);
    const formattedBill = await getBillWithCardAndOwner(updatedBill.id);

    return res.status(200).send(formattedBill);
}

/** Delete a bill */
export async function deleteBill(req: Request, res: Response) {
    const billId = req.params.id as string;
    const bill = await getBill(billId);
    const familyId = req.user.familyId as string;

    if (bill.familyId !== familyId) throw new ForbiddenError("You don't have permission to delete this bill");

    await removeBill(billId);

    return res.status(204).send();
}

/** Create a bill payment */
export async function postBillPayments(req: Request, res: Response) {
    const billId = req.params.id as string;
    const bill = await getBill(billId);
    const familyId = req.user.familyId as string;

    if (bill.familyId !== familyId) throw new ForbiddenError("You don't have permission to add a payment to this bill");

    const postData = PostBillPaymentsDataSchema.parse(req.body);

    await insertBillPayment({ ...postData, billId });

    const updatedBill = await getBillWithCardAndOwner(billId);
    return res.status(200).send(updatedBill);
}

/** Create a bill payment */
export async function deleteBillPayment(req: Request, res: Response) {
    const paymentId = req.params.paymentId as string;
    const billId = req.params.id as string;
    const bill = await getBill(billId);
    const familyId = req.user.familyId as string;

    if (bill.familyId !== familyId) throw new ForbiddenError("You don't have permission to delete a payment from this bill");

    await removeBillPayment(paymentId);

    return res.status(204).send();
}

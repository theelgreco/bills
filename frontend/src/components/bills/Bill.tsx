import type { Bill as BillType, FamilyMember } from "@/api/schemas";
import { formatSortCode, getOrdinalSuffix } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import BillPaymentForm from "./BillPaymentForm";

export interface Props {
    onUpdate: (bill: BillType) => void;
    onDelete: (bill: BillType) => void;
    bill: BillType;
    familyMembers: FamilyMember[];
}

export default function Bill({ onUpdate, onDelete, bill, familyMembers }: Props) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="p-3 flex flex-col gap-3 border border-border rounded-radius bg-background">
            <div className="flex justify-between px-2 items-baseline">
                <h1>{bill.name}</h1>
                <small>£{bill.totalAmountPence / 100}</small>
            </div>
            <div className="flex justify-between px-2 items-baseline">
                <small className="font-extralight">{getOrdinalSuffix(bill.transferDay)} of the month</small>
                {bill.card && (
                    <div className="flex gap-2">
                        <small className="font-extralight">
                            <b>SC:</b> {formatSortCode(bill.card.sortCode)}
                        </small>
                        <small className="font-extralight">
                            <b>AN:</b> {bill.card.accountNumber}
                        </small>
                    </div>
                )}
            </div>
            <hr />
            <div className="flex flex-col gap-3 px-2 py-3">
                {isAdding && (
                    <BillPaymentForm onUpdate={onUpdate} setIsAdding={setIsAdding} billId={bill.id} familyMembers={familyMembers} />
                )}
                {bill.payments?.map((payment) => (
                    <div key={payment.id} className="w-full flex justify-between bg-background border-border">
                        <h2>{payment.payer.name}</h2>
                        <small>£{payment.amountPence / 100}</small>
                    </div>
                ))}
                {bill.payments.length > 0 && (
                    <>
                        <hr className="mt-3" />
                        <div className="flex justify-between">
                            <small>Total</small>
                            <small>
                                £{bill.payments.reduce((accumulator, currentValue) => accumulator + currentValue.amountPence, 0) / 100} / £
                                {bill.totalAmountPence / 100}
                            </small>
                        </div>
                    </>
                )}
                <div className="flex justify-center items-center">
                    <Button
                        className="grow"
                        variant={"ghost"}
                        disabled={isAdding}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAdding(true);
                        }}
                    >
                        <PlusCircle />
                        <small>Add payment</small>
                    </Button>
                </div>
            </div>
        </div>
    );
}

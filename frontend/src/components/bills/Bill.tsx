import type { Bill as BillType, FamilyMember } from "@/api/schemas";
import { formatSortCode, getOrdinalSuffix } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Pencil, PlusCircle, Trash } from "lucide-react";
import BillPaymentForm from "./BillPaymentForm";
import { APIClient } from "@/api/client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

export interface Props {
    onUpdate: (bill: BillType) => void;
    onDelete: (bill: BillType) => void;
    onEdit: (bill: BillType) => void;
    bill: BillType;
    familyMembers: FamilyMember[];
}

export default function Bill({ onUpdate, onDelete, onEdit, bill, familyMembers }: Props) {
    const apiClient = new APIClient();
    const billRef = useRef<HTMLDivElement>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function deleteBill() {
        try {
            setIsDeleting(true);
            await apiClient.fetch(`/bills/${bill.id}`, { method: "DELETE" });
            onDelete(bill);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        if (billRef.current === null) return;

        const billEl = billRef.current;

        const handleEnter = () => setIsHovered(true);
        const handleLeave = () => setIsHovered(false);
        billEl.addEventListener("mouseenter", handleEnter);
        billEl.addEventListener("mouseleave", handleLeave);

        return () => {
            billEl.removeEventListener("mouseenter", handleEnter);
            billEl.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    return (
        <div className="p-3 flex flex-col gap-3 border border-border rounded-radius bg-background">
            <div ref={billRef} className="relative">
                <div className="flex justify-between px-2 items-baseline">
                    <h1>{bill.name}</h1>
                    <small>£{bill.totalAmountPence / 100}</small>
                </div>
                {isHovered && (
                    <>
                        <div className="z-1 flex gap-1 absolute right-0 top-0">
                            <Button variant={"secondary"} size={"sm"} onClick={() => onEdit(bill)}>
                                <Pencil />
                            </Button>
                            <Button variant={"secondary"} size={"sm"} onClick={() => setDeleteDialogOpen(true)} disabled={isDeleting}>
                                <Trash />
                            </Button>
                        </div>
                    </>
                )}
                <div className="flex justify-between px-2 items-baseline mt-3">
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
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(value) => {
                    if (!value && !isDeleting) setDeleteDialogOpen(false);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your {bill.name} bill.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteBill} disabled={isDeleting}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

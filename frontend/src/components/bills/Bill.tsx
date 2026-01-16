import type { Bill as BillType, FamilyMember } from "@/api/schemas";
import { formatSortCode, getOrdinalSuffix } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, Pencil, PlusCircle, Trash } from "lucide-react";
import BillPaymentForm from "./BillPaymentForm";
import BillPayment from "./BillPayment";
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
} from "../ui/alert-dialog";

export interface Props {
    onUpdate: (bill: BillType) => void;
    onDelete: (bill: BillType) => void;
    onEdit: (bill: BillType) => void;
    bill: BillType;
    familyMembers: FamilyMember[];
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export default function Bill({ onUpdate, onDelete, onEdit, bill, familyMembers, isExpanded, onToggleExpand }: Props) {
    const apiClient = new APIClient();
    const [isAdding, setIsAdding] = useState(false);
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

    return (
        <div className="p-3 flex flex-col gap-3 border border-border rounded-radius bg-background">
            <div className="group">
                <div className="flex justify-between px-2 items-center">
                    <div className="flex items-center gap-2">
                        <button onClick={onToggleExpand} className="hover:text-muted-foreground transition-colors">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <h1>{bill.name}</h1>
                        <button
                            onClick={() => onEdit(bill)}
                            className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto text-muted-foreground hover:text-foreground transition-all ml-1"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                            className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto text-muted-foreground hover:text-destructive transition-all disabled:opacity-50"
                        >
                            <Trash size={14} />
                        </button>
                    </div>
                    <small>£{bill.totalAmountPence / 100}</small>
                </div>
                {isExpanded && (
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
                )}
            </div>
            {isExpanded && (
                <>
                    <hr />
                    <div className="flex flex-col gap-3 px-2 py-3">
                        {isAdding && (
                            <BillPaymentForm onUpdate={onUpdate} setIsAdding={setIsAdding} billId={bill.id} familyMembers={familyMembers} />
                        )}
                        {bill.payments?.map((payment) => (
                            <BillPayment
                                key={payment.id}
                                payment={payment}
                                billId={bill.id}
                                onDelete={(paymentId) => {
                                    const updatedBill = {
                                        ...bill,
                                        payments: bill.payments.filter((p) => p.id !== paymentId),
                                    };
                                    onUpdate(updatedBill);
                                }}
                            />
                        ))}
                        {bill.payments.length > 0 && (
                            <>
                                <hr className="mt-3" />
                                <div className="flex justify-between">
                                    <small>Total</small>
                                    <small>
                                        £
                                        {bill.payments.reduce((accumulator, currentValue) => accumulator + currentValue.amountPence, 0) /
                                            100}{" "}
                                        / £{bill.totalAmountPence / 100}
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
                </>
            )}
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

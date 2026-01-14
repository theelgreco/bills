import type { BillPayment as BillPaymentType } from "@/api/schemas";
import { APIClient } from "@/api/client";
import { Trash } from "lucide-react";
import { useState } from "react";
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

interface Props {
    payment: BillPaymentType;
    billId: string;
    onDelete: (paymentId: string) => void;
}

export default function BillPayment({ payment, billId, onDelete }: Props) {
    const apiClient = new APIClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function deletePayment() {
        try {
            setIsDeleting(true);
            await apiClient.fetch(`/bills/${billId}/payments/${payment.id}`, { method: "DELETE" });
            onDelete(payment.id);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <div className="group w-full flex justify-between items-center bg-background border-border">
                <div className="flex items-center gap-2">
                    <small>{payment.payer.name}</small>
                    <button
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={isDeleting}
                        className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto text-muted-foreground hover:text-destructive transition-all disabled:opacity-50"
                    >
                        <Trash size={14} />
                    </button>
                </div>
                <small>£{payment.amountPence / 100}</small>
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
                            This action cannot be undone. This will permanently delete {payment.payer.name}'s £{payment.amountPence / 100}{" "}
                            payment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deletePayment} disabled={isDeleting}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

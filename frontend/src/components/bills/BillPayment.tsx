import type { BillPayment as BillPaymentType } from "@/api/schemas";
import { APIClient } from "@/api/client";
import { Trash } from "lucide-react";
import { useState } from "react";

interface Props {
    payment: BillPaymentType;
    billId: string;
    onDelete: (paymentId: string) => void;
}

export default function BillPayment({ payment, billId, onDelete }: Props) {
    const apiClient = new APIClient();
    const [isDeleting, setIsDeleting] = useState(false);

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
        <div className="w-full flex justify-between items-center bg-background border-border">
            <h2>{payment.payer.name}</h2>
            <div className="flex items-center gap-2">
                <small>£{payment.amountPence / 100}</small>
                <button
                    onClick={deletePayment}
                    disabled={isDeleting}
                    className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                >
                    <Trash size={14} />
                </button>
            </div>
        </div>
    );
}

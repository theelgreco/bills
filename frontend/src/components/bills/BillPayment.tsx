import type { BillPayment as BillPaymentType } from "@/api/schemas";

interface Props {
    payment: BillPaymentType;
}

export default function BillPayment({ payment }: Props) {
    return (
        <div className="w-full flex justify-between bg-background border-border">
            <h2>{payment.payer.name}</h2>
            <small>£{payment.amountPence / 100}</small>
        </div>
    );
}

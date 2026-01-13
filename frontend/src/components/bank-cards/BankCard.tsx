import type { BankCard as BankCardType, BankCard } from "@/api/schemas";
import { Badge } from "../ui/badge";

interface Props {
    card: BankCardType;
}

export default function BankCard({ card }: Props) {
    function formatSortCode(sortCode: number) {
        const [first, second, third, fourth, fifth, sixth] = sortCode.toString().split("");
        return `${first}${second}-${third}${fourth}-${fifth}${sixth}`;
    }

    return (
        <div className="flex flex-col justify-between border border-border bg-card min-w-60 h-30 p-3">
            <div className="flex justify-between">
                <Badge>
                    <small>{card.name}</small>
                </Badge>
                <small className="text-xs"></small>
            </div>
            <div>
                <p>**** **** **** {card.lastFourDigits}</p>
            </div>
            <div className="flex justify-between">
                <small className="text-xs">{formatSortCode(card.sortCode)}</small>
                <small className="text-xs">{card.accountNumber}</small>
            </div>
        </div>
    );
}

import type { BankCard as BankCardType, BankCard } from "@/api/schemas";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { APIClient } from "@/api/client";
import { formatSortCode } from "@/lib/utils";

interface Props {
    card: BankCardType;
    onDelete: (card: BankCardType) => void;
    onEdit: (card: BankCardType) => void;
}

export default function BankCard({ onDelete, onEdit, card }: Props) {
    const apiClient = new APIClient();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function deleteCard() {
        try {
            setIsDeleting(true);
            await apiClient.fetch(`/cards/${card.id}`, { method: "DELETE" });
            onDelete(card);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        if (cardRef.current === null) return;

        const cardEl = cardRef.current;

        const handleEnter = () => setIsHovered(true);
        const handleLeave = () => setIsHovered(false);
        cardEl.addEventListener("mouseenter", handleEnter);
        cardEl.addEventListener("mouseleave", handleLeave);

        return () => {
            cardEl.removeEventListener("mouseenter", handleEnter);
            cardEl.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className="relative flex flex-col justify-between border border-border bg-linear-to-br from-card min-w-60 h-30 p-3 rounded-radius"
        >
            <div className="flex justify-between">
                <Badge>
                    <small>{card.name}</small>
                </Badge>
                <small className="text-xs">{card.owner.name}</small>
                {isHovered && (
                    <>
                        <div className="z-1 flex gap-1 absolute right-2 top-2">
                            <Button variant={"secondary"} size={"sm"} onClick={() => onEdit(card)}>
                                <Pencil />
                            </Button>
                            <Button variant={"secondary"} size={"sm"} onClick={deleteCard} disabled={isDeleting}>
                                <Trash />
                            </Button>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>
                    </>
                )}
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

import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import type { BankCard, Bill as BillType, FamilyMember } from "@/api/schemas";
import Bill from "./Bill";
import { useEffect, useRef, useState } from "react";
import BillForm from "./BillForm";

interface Props {
    onCreate: (bill: BillType) => void;
    onUpdate: (bill: BillType) => void;
    onDelete: (bill: BillType) => void;
    bills: BillType[] | null;
    cards: BankCard[] | null;
    familyMembers: FamilyMember[];
}

export default function Bills({ onCreate, onUpdate, onDelete, bills, cards, familyMembers }: Props) {
    const billsContainerRef = useRef<HTMLDivElement>(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (isAdding && billsContainerRef.current !== null) billsContainerRef.current.scrollTo(0, 0);
    }, [isAdding]);

    return (
        <div className="flex flex-col gap-5 flex-1 min-h-0">
            <div className="flex justify-between items-center">
                <small>BILLS</small>
                <Button
                    variant={"ghost"}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsAdding(true);
                    }}
                >
                    <PlusCircle />
                    <small>Add bill</small>
                </Button>
            </div>
            <div
                ref={billsContainerRef}
                className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0"
                style={{ overflowY: isAdding ? "hidden" : "auto" }}
            >
                {!bills?.length && !isAdding && (
                    <small className="text-center w-fit mx-auto font-extralight">You haven't added any bills yet</small>
                )}
                {isAdding && cards && <BillForm onCreate={onCreate} setIsAdding={setIsAdding} cards={cards} />}
                {bills?.map((bill) => (
                    <Bill key={bill.id} onUpdate={onUpdate} onDelete={onDelete} bill={bill} familyMembers={familyMembers} />
                ))}
            </div>
        </div>
    );
}

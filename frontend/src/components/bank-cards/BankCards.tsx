import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import type { BankCard as BankCardType, FamilyMember } from "@/api/schemas";
import BankCard from "./BankCard";
import { useState } from "react";
import BankCardForm from "./BankCardForm";

interface Props {
    onCreate: (card: BankCardType) => void;
    cards: BankCardType[] | null;
    familyMembers: FamilyMember[] | undefined;
}

export default function BankCards({ onCreate, cards, familyMembers }: Props) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <small>CARDS</small>
                <Button variant={"ghost"} onClick={() => setIsAdding(true)} disabled={isAdding}>
                    <PlusCircle />
                    <small>Add card</small>
                </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
                {!cards?.length && !isAdding && (
                    <small className="text-center w-fit mx-auto font-extralight">You haven't added any cards yet</small>
                )}
                {isAdding && familyMembers && <BankCardForm onCreate={onCreate} setIsAdding={setIsAdding} familyMembers={familyMembers} />}
                {cards?.map((card) => (
                    <BankCard key={card.id} card={card}></BankCard>
                ))}
            </div>
        </div>
    );
}

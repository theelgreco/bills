import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import type { BankCard as BankCardType, FamilyMember } from "@/api/schemas";
import BankCard from "./BankCard";
import { useState } from "react";
import BankCardForm from "./BankCardForm";

interface Props {
    onCreate: (card: BankCardType) => void;
    onUpdate: (card: BankCardType) => void;
    onDelete: (card: BankCardType) => void;
    cards: BankCardType[] | null;
    familyMembers: FamilyMember[] | undefined;
}

export default function BankCards({ onDelete, onCreate, onUpdate, cards, familyMembers }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<BankCardType | undefined>(undefined);

    function handleAddClick() {
        setEditingCard(undefined);
        setIsFormOpen(true);
    }

    function handleEditClick(card: BankCardType) {
        setEditingCard(card);
        setIsFormOpen(true);
    }

    function handleSave(card: BankCardType) {
        if (editingCard) {
            onUpdate(card);
        } else {
            onCreate(card);
        }
    }

    return (
        <div className="flex flex-col gap-5 mb-5">
            <div className="flex justify-between items-center">
                <small>CARDS</small>
                <Button variant={"ghost"} onClick={handleAddClick} disabled={isFormOpen}>
                    <PlusCircle />
                    <small>Add card</small>
                </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
                {!cards?.length && <small className="text-center w-fit mx-auto font-extralight">You haven't added any cards yet</small>}
                {isFormOpen && familyMembers && (
                    <BankCardForm onSave={handleSave} setIsOpen={setIsFormOpen} familyMembers={familyMembers} card={editingCard} />
                )}
                {cards?.map((card) => (
                    <BankCard key={card.id} card={card} onDelete={onDelete} onEdit={handleEditClick}></BankCard>
                ))}
            </div>
        </div>
    );
}

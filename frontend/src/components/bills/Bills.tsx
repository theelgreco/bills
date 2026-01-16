import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import type { BankCard, Bill as BillType, FamilyMember } from "@/api/schemas";
import Bill from "./Bill";
import { useEffect, useMemo, useRef, useState } from "react";
import BillForm from "./BillForm";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface Props {
    onCreate: (bill: BillType) => void;
    onUpdate: (bill: BillType) => void;
    onDelete: (bill: BillType) => void;
    bills: BillType[] | null;
    cards: BankCard[] | null;
    familyMembers: FamilyMember[];
    userId: string;
}

export default function Bills({ onCreate, onUpdate, onDelete, bills, cards, familyMembers, userId }: Props) {
    const billsContainerRef = useRef<HTMLDivElement>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBill, setEditingBill] = useState<BillType | undefined>(undefined);
    const [showOnlyMyBills, setShowOnlyMyBills] = useState(false);

    const filteredBills = useMemo(() => {
        if (!bills) return null;
        if (!showOnlyMyBills) return bills;
        return bills.filter((bill) => bill.payments.some((payment) => payment.payer.id === userId));
    }, [bills, showOnlyMyBills, userId]);

    function handleAddClick() {
        setEditingBill(undefined);
        setIsFormOpen(true);
    }

    function handleEditClick(bill: BillType) {
        setEditingBill(bill);
        setIsFormOpen(true);
    }

    function handleSave(bill: BillType) {
        if (editingBill) {
            onUpdate(bill);
        } else {
            onCreate(bill);
        }
    }

    useEffect(() => {
        if (isFormOpen && billsContainerRef.current !== null) billsContainerRef.current.scrollTo(0, 0);
    }, [isFormOpen]);

    return (
        <div className="flex flex-col gap-5 flex-1 min-h-0">
            <div className="flex justify-between items-center">
                <small>BILLS</small>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Switch id="my-bills-filter" checked={showOnlyMyBills} onCheckedChange={setShowOnlyMyBills} />
                        <Label htmlFor="my-bills-filter" className="text-xs cursor-pointer">
                            My bills only
                        </Label>
                    </div>
                    <Button
                        variant={"ghost"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddClick();
                        }}
                    >
                        <PlusCircle />
                        <small>Add bill</small>
                    </Button>
                </div>
            </div>
            <div ref={billsContainerRef} className="flex flex-col gap-2 flex-1 min-h-0">
                {!filteredBills?.length && !isFormOpen && (
                    <small className="text-center w-fit mx-auto font-extralight">
                        {showOnlyMyBills ? "You don't have any bills assigned to you" : "You haven't added any bills yet"}
                    </small>
                )}
                {isFormOpen && cards && <BillForm onSave={handleSave} setIsOpen={setIsFormOpen} cards={cards} bill={editingBill} />}
                {filteredBills?.map((bill) => (
                    <Bill
                        key={bill.id}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onEdit={handleEditClick}
                        bill={bill}
                        familyMembers={familyMembers}
                    />
                ))}
            </div>
        </div>
    );
}

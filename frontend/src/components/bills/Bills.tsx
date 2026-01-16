import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, PlusCircle } from "lucide-react";
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
    const [isSectionExpanded, setIsSectionExpanded] = useState(true);
    const [collapsedBills, setCollapsedBills] = useState<Set<string>>(new Set());

    const filteredBills = useMemo(() => {
        if (!bills) return null;
        if (!showOnlyMyBills) return bills;
        return bills.filter((bill) => bill.payments.some((payment) => payment.payer.id === userId));
    }, [bills, showOnlyMyBills, userId]);

    const totalMonthlySpend = useMemo(() => {
        if (!bills) return 0;
        return bills.reduce((total, bill) => {
            const userPayments = bill.payments.filter((payment) => payment.payer.id === userId);
            return total + userPayments.reduce((sum, payment) => sum + payment.amountPence, 0);
        }, 0);
    }, [bills, userId]);

    const allBillsExpanded = filteredBills ? filteredBills.every((bill) => !collapsedBills.has(bill.id)) : true;

    function toggleBillExpanded(billId: string) {
        setCollapsedBills((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(billId)) {
                newSet.delete(billId);
            } else {
                newSet.add(billId);
            }
            return newSet;
        });
    }

    function toggleAllBills() {
        if (allBillsExpanded) {
            setCollapsedBills(new Set(filteredBills?.map((b) => b.id) || []));
        } else {
            setCollapsedBills(new Set());
        }
    }

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
        <div className="flex flex-col gap-5 flex-1 min-h-0 pt-5">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
                        className="flex items-center gap-1 hover:text-muted-foreground transition-colors"
                    >
                        {isSectionExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <small>BILLS</small>
                    </button>
                    {isSectionExpanded && (
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
                    )}
                </div>
                {isSectionExpanded && (
                    <div className="flex items-center justify-between gap-2">
                        <small className="font-light">
                            Your total: <span className="font-semibold">£{(totalMonthlySpend / 100).toFixed(2)}</span>
                        </small>
                        <div className="flex items-center gap-2 ml-auto">
                            <Switch id="my-bills-filter" checked={showOnlyMyBills} onCheckedChange={setShowOnlyMyBills} />
                            <Label htmlFor="my-bills-filter" className="text-xs cursor-pointer">
                                My bills only
                            </Label>
                        </div>
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="w-fit"
                            onClick={toggleAllBills}
                            title={allBillsExpanded ? "Collapse all bills" : "Expand all bills"}
                        >
                            {allBillsExpanded ? (
                                <>
                                    <ChevronsDownUp size={16} />
                                    <small>Collapse all</small>
                                </>
                            ) : (
                                <>
                                    <ChevronsUpDown size={16} />
                                    <small>Expand all</small>
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
            {isSectionExpanded && (
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
                            isExpanded={!collapsedBills.has(bill.id)}
                            onToggleExpand={() => toggleBillExpanded(bill.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

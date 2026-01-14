import type { RHFSubmitData } from "@/types/rhf";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "../ui/select";
import type { Bill, FamilyMember } from "@/api/schemas";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { APIClient } from "@/api/client";

interface Props {
    onUpdate: (bill: Bill) => void;
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
    billId: string;
    familyMembers: FamilyMember[];
}

export default function BillPaymentForm({ onUpdate, setIsAdding, billId, familyMembers }: Props) {
    const apiClient = new APIClient();
    const [isLoading, setIsLoading] = useState(false);

    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            amountPence: "",
            payerId: "",
        },
    });

    async function addBillPayment(data: RHFSubmitData<typeof handleSubmit>) {
        const formattedData = {
            amountPence: Number(data.amountPence) * 100,
            payerId: data.payerId,
        };

        try {
            setIsLoading(true);
            const response = (await apiClient.fetch(`/bills/${billId}/payments`, { method: "POST", body: formattedData })) as Bill;
            onUpdate(response);
            setIsAdding(false);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(addBillPayment)} className="flex justify-between gap-3">
            <Controller
                name="payerId"
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                        <SelectTrigger id="card" className="w-full">
                            <SelectValue placeholder="Payer" />
                        </SelectTrigger>
                        <SelectContent className="bg-background! border-border">
                            <SelectGroup>
                                <SelectLabel>Family members</SelectLabel>
                                {familyMembers.map((familyMember) => (
                                    <SelectItem key={familyMember.id} value={familyMember.id}>
                                        {familyMember.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            />
            <Input {...register("amountPence", { required: true })} type="number" placeholder="Payment (£)" min={0} step={0.01} />
            <div className="flex items-center gap-1">
                <Button type="button" size={"icon-sm"} variant={"ghost"} onClick={() => setIsAdding(false)}>
                    <X />
                </Button>
                <Button type="submit" size={"icon-sm"}>
                    <Check />
                </Button>
            </div>
        </form>
    );
}

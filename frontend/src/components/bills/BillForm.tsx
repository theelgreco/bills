import type { BankCard, Bill } from "@/api/schemas";
import type { RHFSubmitData } from "@/types/rhf";
import type React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { APIClient } from "@/api/client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
    onSave: (bill: Bill) => void;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    cards: BankCard[];
    bill?: Bill;
}

export default function BillForm({ onSave, setIsOpen, cards, bill }: Props) {
    const apiClient = new APIClient();
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!bill;

    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            name: bill?.name ?? "",
            totalAmountPence: bill ? bill.totalAmountPence / 100 : 0.01,
            paymentDay: bill?.paymentDay ?? 1,
            transferDay: bill?.transferDay ?? 1,
            cardId: bill?.card?.id ?? "",
        },
    });

    useEffect(() => {
        const handleEscapePress = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) setIsOpen(false);
        };

        window.addEventListener("keydown", handleEscapePress);

        return () => {
            window.removeEventListener("keydown", handleEscapePress);
        };
    }, [setIsOpen, isLoading]);

    async function saveBill(data: RHFSubmitData<typeof handleSubmit>) {
        const formattedData = {
            name: data.name,
            totalAmountPence: Number(data.totalAmountPence) * 100,
            paymentDay: Number(data.paymentDay),
            transferDay: Number(data.transferDay),
            cardId: data.cardId || null,
        };

        try {
            setIsLoading(true);
            const url = isEditing ? `/bills/${bill.id}` : "/bills";
            const method = isEditing ? "PUT" : "POST";
            const response = (await apiClient.fetch(url, { method, body: formattedData })) as Bill;
            onSave(response);
            setIsOpen(false);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <form
                className="z-2 flex flex-col gap-3 justify-between border border-border bg-background max-w-full p-3 pb-0 rounded-radius"
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onSubmit={handleSubmit(saveBill)}
            >
                <div className="mb-3">
                    <h1>{isEditing ? "Edit bill" : "New bill"}</h1>
                    <small className="font-extralight">
                        {isEditing ? "Update the details of your bill" : "Enter the details of your new bill"}
                    </small>
                </div>
                <div className="flex justify-between gap-3">
                    <div className="flex flex-col gap-2 grow">
                        <Label htmlFor="name">
                            <small>Bill name</small>
                        </Label>
                        <Input {...register("name", { required: true })} id="name" />
                    </div>
                    <div className="flex flex-col gap-2 grow">
                        <Label htmlFor="card">
                            <small>Bank card</small>
                        </Label>
                        <Controller
                            name="cardId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading || !cards.length}>
                                    <SelectTrigger id="card" className="w-full">
                                        <SelectValue placeholder={cards.length ? "Bank card" : "No bank cards"} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background! border-border">
                                        <SelectGroup>
                                            <SelectLabel>Bank cards</SelectLabel>
                                            {cards.map((card) => (
                                                <SelectItem key={card.id} value={card.id}>
                                                    {card.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <div className="flex flex-col gap-2 w-1/3">
                        <Label htmlFor="cost">
                            <small>Bill amount (£)</small>
                        </Label>
                        <Input {...register("totalAmountPence", { required: true })} id="cost" type="number" min={0.01} step={0.01} />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                        <Label htmlFor="payment-day">
                            <small>Payment day</small>
                        </Label>
                        <Input {...register("paymentDay", { required: true })} id="payment-day" type="number" min={1} max={31} />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                        <Label htmlFor="transfer-day">
                            <small>Transfer day</small>
                        </Label>
                        <Input {...register("transferDay", { required: true })} id="transfer-day" type="number" min={1} max={31} />
                    </div>
                </div>

                <div className="flex justify-between my-3">
                    <Button type="button" variant={"ghost"} onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant={"ghost"} disabled={isLoading}>
                        <Check size={10} />
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </div>
            </form>
            <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-1" onClick={() => setIsOpen(false)}></div>
        </>
    );
}

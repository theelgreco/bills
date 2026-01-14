import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { RHFSubmitData } from "@/types/rhf";
import type { BankCard, FamilyMember } from "@/api/schemas";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { APIClient } from "@/api/client";
import { socketEmit } from "@/hooks/socket";

interface Props {
    onSave: (card: BankCard) => void;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    familyMembers: FamilyMember[];
    card?: BankCard;
}

export default function BankCardForm({ onSave, setIsOpen, familyMembers, card }: Props) {
    const apiClient = new APIClient();
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!card;

    const { register, handleSubmit, control } = useForm({
        defaultValues: {
            name: card?.name ?? "",
            lastFourDigits: card?.lastFourDigits ?? "",
            sortCode: card?.sortCode ?? "",
            accountNumber: card?.accountNumber ?? "",
            ownerId: card?.owner.id ?? "",
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

    async function saveCard(data: RHFSubmitData<typeof handleSubmit>) {
        try {
            setIsLoading(true);
            const url = isEditing ? `/cards/${card.id}` : "/cards";
            const method = isEditing ? "PUT" : "POST";
            const response = (await apiClient.fetch(url, { method, body: data })) as BankCard;
            const emit = isEditing ? "update-card" : "add-card";
            socketEmit(emit, response);
            onSave(response);
            setIsOpen(false);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="z-1 fixed top-0 left-0 w-full h-full bg-black/70" onClick={() => setIsOpen(false)}>
            <form
                ref={formRef}
                className="w-full max-w-100 p-3 pb-0 z-1 absolute top-1/2 left-1/2 -translate-1/2 flex flex-col gap-3 justify-between border border-border bg-background rounded-radius"
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onSubmit={handleSubmit(saveCard)}
            >
                <div className="mb-3">
                    <h1>{isEditing ? "Edit card" : "New card"}</h1>
                    <small className="font-extralight">
                        {isEditing ? "Update the details of your card" : "Enter the details of your new card"}
                    </small>
                </div>

                <div className="flex justify-between gap-3">
                    <Input
                        {...register("name", { required: true })}
                        className="w-full py-0! text-sm!"
                        placeholder="Card name"
                        disabled={isLoading}
                    />
                    <Controller
                        name="ownerId"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Card owner" />
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
                </div>
                <div className="flex text-nowrap items-center gap-3">
                    <Input
                        {...register("lastFourDigits", { required: true })}
                        className="w-full py-0! text-sm!"
                        placeholder="Last 4 digits"
                        disabled={isLoading}
                    />
                </div>
                <div className="flex justify-between gap-3">
                    <Input
                        {...register("sortCode", { required: true })}
                        className="max-w-full py-0! text-sm!"
                        placeholder="Sort code"
                        disabled={isLoading}
                    />
                    <Input
                        {...register("accountNumber", { required: true })}
                        className="max-w-full py-0! text-sm!"
                        placeholder="Account no."
                        disabled={isLoading}
                    />
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
        </div>
    );
}

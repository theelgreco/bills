import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { RHFSubmitData } from "@/types/rhf";
import type { BankCard, FamilyMember } from "@/api/schemas";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { APIClient } from "@/api/client";

interface Props {
    onCreate: (card: BankCard) => void;
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
    familyMembers: FamilyMember[];
}

export default function BankCardForm({ onCreate, setIsAdding, familyMembers }: Props) {
    const apiClient = new APIClient();
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            lastFourDigits: "",
            sortCode: "",
            accountNumber: "",
            ownerId: "",
        },
    });

    useEffect(() => {
        const handleEscapePress = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsAdding(false);
        };

        window.addEventListener("keydown", handleEscapePress);

        return () => {
            window.removeEventListener("keydown", handleEscapePress);
        };
    }, [setIsAdding, isLoading]);

    async function addCard(data: RHFSubmitData<typeof handleSubmit>) {
        console.log(data);
        try {
            setIsLoading(true);
            const response = (await apiClient.fetch("/cards", { method: "POST", body: data })) as BankCard;
            onCreate(response);
            setIsAdding(false);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/70" onClick={() => setIsAdding(false)}>
            <form
                onClick={(e) => {
                    e.stopPropagation();
                }}
                ref={formRef}
                className="z-1 absolute top-1/2 left-1/2 -translate-1/2 flex flex-col justify-between border border-border bg-card min-w-100 max-w-full h-50 p-3 pb-0"
                onSubmit={handleSubmit(addCard)}
            >
                <div className="flex justify-between gap-3">
                    <Input
                        {...register("name")}
                        className="w-full py-0! text-sm! border-t-0! border-x-0! bg-card!"
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
                                <SelectContent>
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
                        {...register("lastFourDigits")}
                        className="w-full py-0! text-sm! border-t-0! border-x-0! bg-card!"
                        placeholder="Last 4 digits"
                        disabled={isLoading}
                    />
                </div>
                <div className="flex justify-between gap-5">
                    <Input
                        {...register("sortCode")}
                        className="max-w-full py-0! text-sm! border-t-0! border-x-0! bg-card!"
                        placeholder="Sort code"
                        disabled={isLoading}
                    />
                    <Input
                        {...register("accountNumber")}
                        className="max-w-full py-0! text-sm! border-t-0! border-x-0! bg-card!"
                        placeholder="Account no."
                        disabled={isLoading}
                    />
                </div>
                <div className="flex justify-between my-3">
                    <Button type="button" variant={"ghost"} onClick={() => setIsAdding(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant={"ghost"} disabled={isLoading}>
                        <Check size={10} />
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

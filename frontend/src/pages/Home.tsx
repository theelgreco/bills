import { APIClient } from "@/api/client";
import type { BankCard, Bill, Family } from "@/api/schemas";
import BankCards from "@/components/bank-cards/BankCards";
import Bills from "@/components/bills/Bills";
import CreateFamily from "@/components/CreateFamily";
import ThemeSwitch from "@/components/ThemeSwitch";
import { useUser } from "@/hooks/user";
import { getInitials, stringToHexColor } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Home() {
    const apiClient = new APIClient();

    const [, setIsLoading] = useState(false);
    const [family, setFamily] = useState<Family | null>(null);
    const [cards, setCards] = useState<BankCard[] | null>(null);
    const [bills, setBills] = useState<Bill[] | null>(null);
    const [avatarIcons, setAvatarIcons] = useState<{ backgroundColor: string; initials: string; id: string }[]>([]);
    const { user, joinFamily } = useUser();

    async function getFamily() {
        if (!user?.familyId) return;
        try {
            setIsLoading(true);
            const response = (await apiClient.fetch(`/families/${user.familyId}`, { method: "GET" })) as Family;
            setFamily(response);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function getCards() {
        if (!user?.familyId) return;
        const response = (await apiClient.fetch("/cards", { method: "GET" })) as BankCard[];
        setCards(response);
    }

    async function getBills() {
        if (!user?.familyId) return;
        const response = (await apiClient.fetch("/bills", { method: "GET" })) as Bill[];
        setBills(response);
    }

    useEffect(() => {
        if (user?.familyId && !family) {
            getFamily();
        }
    }, [user?.familyId, family]);

    useEffect(() => {
        if (user?.familyId) {
            getCards();
            getBills();
        }
    }, [user?.familyId]);

    useEffect(() => {
        if (family?.members) {
            (async () => {
                const icons = [];
                for (let i = 0; i < family.members.length; i++) {
                    const member = family.members[i];
                    icons.push({
                        id: member.id,
                        backgroundColor: await stringToHexColor(member.name),
                        initials: getInitials(member.name),
                    });
                }
                setAvatarIcons(icons);
            })();
        }
    }, [family?.members]);

    return (
        <section className="w-125 h-full max-w-full max-h-full flex flex-col gap-5 mx-auto p-10 overflow-hidden">
            <div className="flex flex-col items-center">
                <h1 className="text-center text-2xl">Welcome, {user?.name}</h1>
                {family && (
                    <>
                        <h2 className="text-center font-thin">of the {family.name} tribe.</h2>
                        <div className="flex gap-2 mt-3">
                            {avatarIcons.map((member) => (
                                <div
                                    key={member.id}
                                    className="w-10 aspect-square rounded-full grid place-items-center select-none"
                                    title={family.members.find((famMemb) => famMemb.id === member.id)?.name}
                                    style={{
                                        backgroundColor: member.backgroundColor,
                                        border: `1px solid color-mix(in srgb, ${member.backgroundColor}, white 60%)`,
                                    }}
                                >
                                    <small style={{ color: `color-mix(in srgb, ${member.backgroundColor}, white 80%)` }}>
                                        {member.initials}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <hr />
            {user?.familyId ? (
                <div className="flex flex-col flex-1 min-h-0 gap-5">
                    <BankCards
                        onDelete={(card) => setCards((prev) => (prev || []).filter((prevCard) => prevCard.id !== card.id))}
                        onCreate={(card) => {
                            setCards((prev) => [...(prev || []), card]);
                        }}
                        cards={cards}
                        familyMembers={family?.members}
                    />
                    <hr />
                    <Bills
                        onCreate={(bill) => setBills((prev) => [...(prev || []), bill])}
                        onUpdate={(bill) => {
                            setBills((prev) => (prev || []).map((prevBill) => (prevBill.id === bill.id ? bill : prevBill)));
                        }}
                        onDelete={(bill) => setBills((prev) => (prev || []).filter((prevBill) => prevBill.id !== bill.id))}
                        bills={bills}
                        cards={cards}
                        familyMembers={family?.members || []}
                    />
                </div>
            ) : (
                <CreateFamily
                    setFamily={(_family) => {
                        joinFamily(_family.id);
                        setFamily(_family);
                    }}
                />
            )}
            <hr className="mt-auto" />
            <div className="flex">
                <ThemeSwitch />
            </div>
        </section>
    );
}

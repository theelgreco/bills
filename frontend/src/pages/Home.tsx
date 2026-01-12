import { APIClient } from "@/api/client";
import type { Family } from "@/api/schemas";
import BankCards from "@/components/bank-cards/BankCards";
import Bills from "@/components/bills/Bills";
import CreateFamily from "@/components/CreateFamily";
import { useUser } from "@/hooks/user";
import { getInitials, stringToHexColor } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Home() {
    const apiClient = new APIClient();
    const { user, joinFamily } = useUser();
    const [family, setFamily] = useState<Family | null>(null);
    const [, setIsLoading] = useState(false);
    const [avatarIcons, setAvatarIcons] = useState<{ backgroundColor: string; initials: string; id: string }[]>([]);

    useEffect(() => {
        if (user?.familyId && !family) {
            const getFamily = async () => {
                try {
                    setIsLoading(true);
                    const response = (await apiClient.fetch(`/families/${user.familyId}`, { method: "GET" })) as Family;
                    setFamily(response);
                } catch (err: unknown) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            getFamily();
        }
    }, [user?.familyId, family]);

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
        <section className="w-full h-full max-w-full max-h-full">
            <div className="flex flex-col gap-5 mx-auto w-125 h-full max-w-full max-h-full p-10 overflow-hidden">
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
                <hr className="mb-5" />
                {user?.familyId ? (
                    <>
                        <BankCards />
                        <hr className="my-5" />
                        <Bills />
                    </>
                ) : (
                    <CreateFamily
                        setFamily={(_family) => {
                            joinFamily(_family.id);
                            setFamily(_family);
                        }}
                    />
                )}
            </div>
        </section>
    );
}

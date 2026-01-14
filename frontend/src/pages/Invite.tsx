import { APIClient, ResponseError } from "@/api/client";
import type { Family, User } from "@/api/schemas";
import { Button } from "@/components/ui/button";
import { localStorageKeys } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

type InviteState = "already-in-family" | "ready-to-join" | "joining" | "success" | "error";

function getInitialState(familyId: string | null, user: User | null): { state: InviteState; error: string | null } {
    if (!familyId) return { state: "error", error: "Invalid invite link" };
    if (!user) return { state: "ready-to-join", error: null }; // Will redirect in effect
    if (user.familyId) return { state: "already-in-family", error: null };
    return { state: "ready-to-join", error: null };
}

export default function Invite() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const familyId = searchParams.get("familyId");

    // Check if user is logged in
    const storedUser = localStorage.getItem(localStorageKeys.USER);
    const user: User | null = useMemo(() => (storedUser ? JSON.parse(storedUser) : null), [storedUser]);

    const initialState = getInitialState(familyId, user);
    const [state, setState] = useState<InviteState>(initialState.state);
    const [error, setError] = useState<string | null>(initialState.error);
    const [family, setFamily] = useState<Family | null>(null);

    const apiClient = new APIClient();

    // Redirect to login if not logged in
    useEffect(() => {
        if (!user && familyId) {
            navigate(`/login?redirect=${encodeURIComponent(`/invite?familyId=${familyId}`)}`, { replace: true });
        }
    }, [familyId, user, navigate]);

    async function joinFamily() {
        if (!familyId || !user) return;

        try {
            setState("joining");
            const response = (await apiClient.fetch(`/families/${familyId}/join`, { method: "POST" })) as Family;
            setFamily(response);

            // Update user in localStorage with new familyId
            const updatedUser = { ...user, familyId };
            localStorage.setItem(localStorageKeys.USER, JSON.stringify(updatedUser));

            setState("success");
        } catch (err: unknown) {
            const error = err as ResponseError;
            setState("error");
            setError(error.message || "Failed to join family");
        }
    }

    function goHome() {
        navigate("/", { replace: true });
    }

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="flex flex-col items-center gap-5 p-8 border border-border rounded-radius bg-background max-w-md">
                {state === "already-in-family" && (
                    <>
                        <h1 className="text-xl">Already in a Family</h1>
                        <p className="text-center text-muted-foreground">You're already part of a family. You can't join another one.</p>
                        <Button onClick={goHome}>Go to Home</Button>
                    </>
                )}

                {state === "ready-to-join" && (
                    <>
                        <h1 className="text-xl">You've Been Invited!</h1>
                        <p className="text-center text-muted-foreground">
                            You've been invited to join a family. Click below to accept the invitation.
                        </p>
                        <Button onClick={joinFamily}>Join Family</Button>
                    </>
                )}

                {state === "joining" && (
                    <>
                        <h1 className="text-xl">Joining...</h1>
                        <p className="text-center text-muted-foreground">Please wait while we add you to the family.</p>
                    </>
                )}

                {state === "success" && (
                    <>
                        <h1 className="text-xl">Welcome!</h1>
                        <p className="text-center text-muted-foreground">
                            You've successfully joined {family?.name ? `the ${family.name} family` : "the family"}!
                        </p>
                        <Button onClick={goHome}>Go to Home</Button>
                    </>
                )}

                {state === "error" && (
                    <>
                        <h1 className="text-xl">Error</h1>
                        <p className="text-center text-muted-foreground">{error || "Something went wrong"}</p>
                        <Button onClick={goHome}>Go to Home</Button>
                    </>
                )}
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import z from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.string(),
    familyId: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export function getInitialUser(): User | null {
    try {
        const stored = localStorage.getItem("bills-user");
        if (!stored) return null;
        return UserSchema.parse(JSON.parse(stored));
    } catch (err: unknown) {
        console.error(err);
        return null;
    }
}

export function useUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(getInitialUser());

    useEffect(() => {
        if (user === null) {
            console.log(user);
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    function login(user: User) {
        localStorage.setItem("bills-user", JSON.stringify(user));
        setUser(user);
        navigate("/", { replace: true });
    }

    return { user, login };
}

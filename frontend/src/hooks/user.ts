import { type User, UserSchema } from "@/api/schemas";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    function login(user: User) {
        localStorage.setItem("bills-user", JSON.stringify(user));
        setUser(user);
        navigate("/", { replace: true });
    }

    function joinFamily(familyId: string) {
        if (user) {
            const newUser = { ...user, familyId };
            localStorage.setItem("bills-user", JSON.stringify(newUser));
            setUser(newUser);
        }
    }

    return { user, login, joinFamily };
}

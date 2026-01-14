import { type User, UserSchema } from "@/api/schemas";
import { localStorageKeys } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

export function getInitialUser(): User | null {
    try {
        const stored = localStorage.getItem(localStorageKeys.USER);
        if (!stored) return null;
        return UserSchema.parse(JSON.parse(stored));
    } catch (err: unknown) {
        console.error(err);
        return null;
    }
}

export function useUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<User | null>(getInitialUser());

    useEffect(() => {
        // Don't redirect if already on login or invite page
        if (user === null && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/invite")) {
            const currentParams = searchParams.toString();
            navigate(`/login${currentParams ? `?${currentParams}` : ""}`, { replace: true });
        }
    }, [user, navigate, searchParams, location.pathname]);

    function login(user: User) {
        localStorage.setItem(localStorageKeys.USER, JSON.stringify(user));
        setUser(user);
        const redirect = searchParams.get("redirect");
        navigate(redirect || "/", { replace: true });
    }

    function logout() {
        localStorage.removeItem(localStorageKeys.USER);
        setUser(null);
    }

    function joinFamily(familyId: string) {
        if (user) {
            const newUser = { ...user, familyId };
            localStorage.setItem(localStorageKeys.USER, JSON.stringify(newUser));
            setUser(newUser);
        }
    }

    return { user, login, logout, joinFamily };
}

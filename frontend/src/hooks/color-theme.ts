import { localStorageKeys } from "@/lib/constants";
import { useEffect, useState } from "react";

export type ColorThemes = "light" | "dark";

function getInitialTheme(): ColorThemes {
    const localTheme = localStorage.getItem(localStorageKeys.THEME);
    if (localTheme && ["dark", "light"].includes(localTheme)) return localTheme as ColorThemes;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useColorScheme() {
    const [theme, setTheme] = useState<ColorThemes>(getInitialTheme());

    useEffect(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handleThemeChange = (event: MediaQueryListEvent) => {
            setTheme(event.matches ? "dark" : "light");
        };

        mql.addEventListener("change", handleThemeChange);
        return () => mql.removeEventListener("change", handleThemeChange);
    }, []);

    useEffect(() => {
        localStorage.setItem(localStorageKeys.THEME, theme);
        document.documentElement.dataset["theme"] = theme;
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }

    return { theme, setTheme, toggleTheme };
}

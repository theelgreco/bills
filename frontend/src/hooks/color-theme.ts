import { useEffect, useState } from "react";

export type ColorThemes = "light" | "dark";
const localStorageKey = "bills-theme";

function getInitialTheme(): ColorThemes {
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
        localStorage.setItem(localStorageKey, theme);
        document.documentElement.dataset["theme"] = theme;
    }, [theme]);

    return { theme, setTheme };
}

import { Label } from "@radix-ui/react-label";
import { Switch } from "./ui/switch";
import { useColorScheme } from "@/hooks/color-theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitch() {
    const { theme, toggleTheme } = useColorScheme();
    return (
        <div className="flex items-center space-x-2 ml-auto">
            <Label htmlFor={theme === "dark" ? "theme" : ""}>
                <Moon
                    size={18}
                    className={"transition-all ease-out" + (theme === "dark" ? " opacity-50" : "")}
                    fill={theme === "light" ? "black" : "transparent"}
                />
            </Label>
            <Switch id="theme" checked={theme === "dark"} onCheckedChange={() => toggleTheme()} />
            <Label htmlFor={theme === "light" ? "theme" : ""}>
                <Sun
                    size={18}
                    className={"transition-all ease-out" + (theme === "light" ? " opacity-50" : "")}
                    fill={theme === "dark" ? "white" : "transparent"}
                />
            </Label>
        </div>
    );
}

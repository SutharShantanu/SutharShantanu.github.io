"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { ThemeToggleProps } from "./types/theme-toggle.types";

const subscribe = () => () => {};

const THEMES = [
    { key: "system", icon: Monitor, label: "System theme" },
    { key: "light", icon: Sun, label: "Light theme" },
    { key: "dark", icon: Moon, label: "Dark theme" },
] as const;

const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const { theme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);

    if (!mounted) return null;

    return (
        <ToggleButtonGroup
            aria-label="Color theme"
            size="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([theme ?? "system"])}
            onSelectionChange={(keys) => {
                const [next] = keys;
                if (next) setTheme(String(next));
            }}
            className={className}
        >
            {THEMES.map(({ key, icon: Icon, label }, i) => (
                <ToggleButton key={key} id={key} isIconOnly aria-label={label}>
                    {i > 0 && <ToggleButtonGroup.Separator />}
                    <Icon className="size-4" />
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};

export default ThemeToggle;

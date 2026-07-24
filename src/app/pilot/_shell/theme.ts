"use client";

/**
 * Shared theme hook for the pilot app-shell. Light / Dark / Auto; Auto follows
 * the OS and reacts live. The initial class is set pre-paint by the inline
 * script in layout.tsx (avoids a flash); this hook re-applies + persists.
 */

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "auto";

export function isThemeMode(v: unknown): v is ThemeMode {
  return v === "light" || v === "dark" || v === "auto";
}

export function useTheme() {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "auto";
    const saved = localStorage.getItem("theme");
    return isThemeMode(saved) ? saved : "auto";
  });
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "auto" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    localStorage.setItem("theme", mode);
    if (mode !== "auto") return;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode]);
  return { mode, setMode };
}

export const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "auto", label: "Auto", icon: Monitor },
];

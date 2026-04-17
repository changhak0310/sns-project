"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { ShellTheme } from "@/types/app-shell";

const STORAGE_KEY = "orbit-shell-theme";
const CHANGE_EVENT = "orbit-shell-theme-change";

type ThemeUpdater = ShellTheme | ((currentTheme: ShellTheme) => ShellTheme);

function isShellTheme(value: string | null): value is ShellTheme {
  return value === "dark" || value === "light";
}

function getStoredTheme(defaultTheme: ShellTheme): ShellTheme {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return isShellTheme(storedTheme) ? storedTheme : defaultTheme;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleThemeChange = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, handleThemeChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, handleThemeChange);
  };
}

export function useShellTheme(defaultTheme: ShellTheme = "dark") {
  const theme = useSyncExternalStore(
    subscribe,
    () => getStoredTheme(defaultTheme),
    () => defaultTheme
  );

  const setTheme = useCallback(
    (nextTheme: ThemeUpdater) => {
      const resolvedTheme =
        typeof nextTheme === "function"
          ? nextTheme(getStoredTheme(defaultTheme))
          : nextTheme;

      window.localStorage.setItem(STORAGE_KEY, resolvedTheme);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [defaultTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}

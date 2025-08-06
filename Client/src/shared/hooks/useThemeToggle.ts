import { createContext, useContext } from "react";

export type ThemeToggleType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

export const ThemeToggleContext = createContext<ThemeToggleType>({
  mode: "light",
  toggleTheme: () => {},
});

export function useThemeToggle() {
  const context = useContext(ThemeToggleContext);
  if (context === undefined) {
    throw new Error("useThemeToggle must be used within a ThemeToggleProvider.");
  }
  return context;
}

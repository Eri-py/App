import type { getUserResponse } from "@/api/AuthApi";
import { createContext, useContext } from "react";

export type AuthContextTypes = getUserResponse & {
  refreshUser: () => void;
};

export const AuthContext = createContext<AuthContextTypes>({
  isAuthenticated: false,
  user: null,
  refreshUser: () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

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
  return context;
}

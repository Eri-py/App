import { createContext, useContext } from "react";

export const BreakpointContext = createContext<{ isSmOrLarger: boolean }>({
  isSmOrLarger: false,
});

export function useBreakpoint() {
  const context = useContext(BreakpointContext);
  if (context === undefined) {
    throw new Error("useBreakpoint must be used within a BreakpointProvider.");
  }
  return context;
}

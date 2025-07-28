import { createContext, useContext } from "react";

export const BreakpointContext = createContext<{ isSmOrLarger: boolean }>({
  isSmOrLarger: false,
});

export function useBreakpoint() {
  const context = useContext(BreakpointContext);
  return context;
}

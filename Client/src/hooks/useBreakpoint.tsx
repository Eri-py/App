import { createContext, useContext } from "react";
// Create the context
export const BreakpointContext = createContext<{
  isSmOrLarger: boolean;
}>({
  isSmOrLarger: false,
});
// Custom hook to use the context

export const useBreakpoint = () => {
  const context = useContext(BreakpointContext);
  if (context === undefined) {
    throw new Error("useBreakpoint must be used within a BreakpointProvider");
  }
  return context;
};

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { MobileSearchMode } from "@/features/home/components/MobileSearchMode";
import { DesktopNavbar } from "@/features/home/components/Navbar/DesktopNavbar";
import { MobileNavbar } from "@/features/home/components/Navbar/MobileNavbar";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileSearch, setIsMobileSearch] = useState<boolean>(false);
  const { isSmOrLarger } = useBreakpoint();

  return (
    <div>
      {!isMobileSearch && (
        <>
          {isSmOrLarger ? (
            <DesktopNavbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
          ) : (
            <MobileNavbar
              onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
              onSearchClick={() => setIsMobileSearch(true)}
            />
          )}
        </>
      )}
      {isMobileSearch && <MobileSearchMode onBack={() => setIsMobileSearch(false)} />}
    </div>
  );
}

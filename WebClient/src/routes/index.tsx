import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";

import { DesktopNavbar } from "@/features/home/Desktop/Navbar";
import { Sidebar } from "@/features/home/Desktop/Sidebar";
import { MobileNavbar } from "@/features/home/Mobile/Navbar";
import { MobileSearchMode } from "@/features/home/Mobile/SearchView";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";
import { BottomNavbar } from "@/features/home/Mobile/BottomNavbar";
import { TestMainContent } from "@/features/home/components/TestMainContent";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileSearch, setIsMobileSearch] = useState<boolean>(false);
  const { isSmOrLarger } = useBreakpoint();

  useEffect(() => {
    if (isSmOrLarger) {
      setIsMobileSearch(false);
    }
  }, [isSmOrLarger]);

  return (
    <Stack>
      {/* Header */}
      {!isMobileSearch && (
        <>
          {isSmOrLarger ? (
            <DesktopNavbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
          ) : (
            <MobileNavbar onSearchClick={() => setIsMobileSearch(true)} />
          )}
        </>
      )}

      {isMobileSearch && <MobileSearchMode onBack={() => setIsMobileSearch(false)} />}

      {/* Main content area */}
      {!isMobileSearch && (
        <Stack
          direction="column"
          height={{ xs: "calc(100dvh - 3.25rem - 3rem)", sm: "calc(100dvh - 3.75rem)" }}
        >
          {isSmOrLarger ? (
            <Stack direction="row" flex={1} overflow="hidden">
              <Sidebar isOpen={isMenuOpen} />
              <Stack flex={1} alignItems="center" overflow="auto">
                <TestMainContent />
              </Stack>
            </Stack>
          ) : (
            <Stack flex={1} alignItems="center" overflow="auto">
              <TestMainContent />
            </Stack>
          )}
        </Stack>
      )}

      {/* Mobile footer */}
      {!isSmOrLarger && !isMobileSearch && <BottomNavbar />}
    </Stack>
  );
}

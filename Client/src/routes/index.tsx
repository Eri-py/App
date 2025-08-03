import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { DesktopNavbar } from "@/features/home/Desktop/Navbar";
import { Sidebar } from "@/features/home/Desktop/Sidebar";
import { MobileNavbar } from "@/features/home/Mobile/Navbar";
import { MobileSearchMode } from "@/features/home/Mobile/SearchView";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";

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
    <Box sx={{ flexGrow: 1 }}>
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
      {!isMobileSearch && (
        <Stack
          direction="row"
          height={{ xs: "calc(100dvh - 3.25rem)", sm: "calc(100dvh - 3.75rem)" }}
        >
          {isSmOrLarger && <Sidebar isOpen={isMenuOpen} />}
          <Stack flex={1} alignItems="center">
            <Typography>Hello world</Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

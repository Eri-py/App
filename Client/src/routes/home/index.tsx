import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { MobileSearchMode } from "@/features/home/components/MobileSearchMode";
import { DesktopNavbar } from "@/features/home/components/Navbar/DesktopNavbar";
import { MobileNavbar } from "@/features/home/components/Navbar/MobileNavbar";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";
import { Sidebar } from "@/features/home/components/Sidebar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const Route = createFileRoute("/home/")({
  component: Home,
});

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [isMobileSearch, setIsMobileSearch] = useState<boolean>(false);
  const { isSmOrLarger } = useBreakpoint();

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
      <Stack
        direction="row"
        height={{ xs: "calc(100dvh - 3.75rem)", sm: "calc(100dvh - 3.75rem)" }}
        border="1px solid green"
      >
        {isSmOrLarger && <Sidebar isOpen={isMenuOpen} />}
        <Stack>
          <Typography>//TODO: Main content</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

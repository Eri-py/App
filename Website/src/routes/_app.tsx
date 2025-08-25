import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Stack from "@mui/material/Stack";

import { DesktopNavbar } from "@/features/home/Desktop/Navbar";
import { Sidebar } from "@/features/home/Desktop/Sidebar";
import { MobileNavbar } from "@/features/home/Mobile/Navbar";
import { MobileSearchMode } from "@/features/home/Mobile/SearchView";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";
import { BottomNavbar } from "@/features/home/Mobile/BottomNavbar";
import { getUserDetails } from "@/api/AuthApi";
import { AuthContext } from "@/features/app/hooks/useAuth";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileSearch, setIsMobileSearch] = useState<boolean>(false);
  const { isSmOrLarger } = useBreakpoint();

  // Reset mobile mode if the window becomes larger
  useEffect(() => {
    if (isSmOrLarger) {
      setIsMobileSearch(false);
    }
  }, [isSmOrLarger]);

  // Fetch user details on Website mount.
  const { data, isPending } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
    refetchOnWindowFocus: false,
  });

  const authContextValue = {
    isAuthenticated: data?.data.isAuthenticated,
    user: data?.data.user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {isPending ? (
        <div>Loading...</div>
      ) : (
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
                <Stack direction="row" flex={1} overflow="hidden" gap={2}>
                  <Sidebar isOpen={isMenuOpen} />
                  <Stack flex={1} alignItems="center" overflow="auto" padding={1} gap="1.75rem">
                    <Outlet />
                  </Stack>
                </Stack>
              ) : (
                <Stack flex={1} alignItems="center" overflow="auto">
                  <Outlet />
                </Stack>
              )}
            </Stack>
          )}

          {/* Mobile footer */}
          {!isSmOrLarger && !isMobileSearch && <BottomNavbar />}
        </Stack>
      )}
    </AuthContext.Provider>
  );
}

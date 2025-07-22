import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";

import { Logo, LogoWithName } from "../../../components/Logo";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { LeftButtonGroup, DesktopRightButtons, MobileRightButtons } from "./NavbarSections";
import { Searchbar } from "./Searchbar";
import { Sidebar } from "./Sidebar";

const MobileSearchMode = ({ onBack }: { onBack: () => void }) => (
  <Stack direction="row" flex={1} gap={1}>
    <IconButton onClick={onBack}>
      <ArrowBackIcon />
    </IconButton>
    <Searchbar autoFocus />
  </Stack>
);

const MobileNavMode = ({
  onMenuClick,
  onSearchClick,
}: {
  onMenuClick: () => void;
  onSearchClick: () => void;
}) => (
  <>
    <LeftButtonGroup onMenuClick={onMenuClick}>
      <Logo width="27px" />
    </LeftButtonGroup>
    <MobileRightButtons onSearchClick={onSearchClick} />
  </>
);

const DesktopNav = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <>
    <LeftButtonGroup onMenuClick={onMenuClick}>
      <LogoWithName size="medium" />
    </LeftButtonGroup>
    <Searchbar />
    <DesktopRightButtons />
  </>
);

export function Navbar() {
  const { isSmOrLarger } = useBreakpoint();
  const [isSearchMobile, setIsSearchMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openMobileSearch = () => setIsSearchMobile(true);
  const closeMobileSearch = () => setIsSearchMobile(false);

  const renderContent = () => {
    if (isSmOrLarger) {
      return <DesktopNav onMenuClick={toggleSidebar} />;
    }

    if (isSearchMobile) {
      return <MobileSearchMode onBack={closeMobileSearch} />;
    }

    return <MobileNavMode onMenuClick={toggleSidebar} onSearchClick={openMobileSearch} />;
  };

  return (
    <Box>
      <AppBar sx={{ padding: 0.25, height: { xs: 55, sm: 65 } }}>
        <Toolbar
          variant="dense"
          sx={{
            justifyContent: "space-between",
            gap: 3,
            paddingInline: { xs: 0.75 },
            paddingBlock: { xs: 0.5, sm: 0.75 },
          }}
        >
          {renderContent()}
        </Toolbar>
      </AppBar>

      {isSidebarOpen && <Sidebar />}
    </Box>
  );
}

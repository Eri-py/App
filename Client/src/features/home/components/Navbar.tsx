import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { LeftButtonGroup, DesktopRightButtons, MobileRightButtons } from "./NavbarSections";
import { Searchbar } from "./Searchbar";
import Stack from "@mui/material/Stack";

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
    <LeftButtonGroup onMenuClick={onMenuClick}></LeftButtonGroup>
    <MobileRightButtons onSearchClick={onSearchClick} />
  </>
);

const DesktopNav = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <>
    <LeftButtonGroup onMenuClick={onMenuClick} />
    <Searchbar />
    <DesktopRightButtons />
  </>
);

export function Navbar() {
  const { isSmOrLarger } = useBreakpoint();
  const [isSearchMobile, setIsSearchMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    if (isSmOrLarger) {
      return <DesktopNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />;
    }

    if (isSearchMobile) {
      return <MobileSearchMode onBack={() => setIsSearchMobile(false)} />;
    }

    return (
      <MobileNavMode
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearchClick={() => setIsSearchMobile(true)}
      />
    );
  };

  return (
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
  );
}

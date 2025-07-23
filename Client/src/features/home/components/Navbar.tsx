import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { LeftButtonGroup, DesktopRightButtons, MobileRightButtons } from "./NavbarSections";
import { Searchbar } from "./Searchbar";

type NavbarProps = {
  onMenuClick: () => void;
  onSearchClick: () => void;
};

export function Navbar({ onMenuClick, onSearchClick }: NavbarProps) {
  const { isSmOrLarger } = useBreakpoint();

  return (
    <>
      <AppBar sx={{ padding: 0.25, height: { xs: 55, sm: 65 } }}>
        <Toolbar
          variant="dense"
          sx={{
            justifyContent: "space-between",
            gap: 3,
            paddingInline: { xs: 1 },
            paddingBlock: 0.75,
          }}
        >
          {isSmOrLarger ? (
            <>
              <LeftButtonGroup onMenuClick={onMenuClick} />
              <Searchbar />
              <DesktopRightButtons />
            </>
          ) : (
            <>
              <LeftButtonGroup onMenuClick={onMenuClick} />
              <MobileRightButtons onSearchClick={onSearchClick} />
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

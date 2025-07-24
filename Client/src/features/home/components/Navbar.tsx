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
      <AppBar sx={{ height: { xs: "3.25rem", sm: "3.75rem" } }}>
        <Toolbar
          variant="dense"
          sx={{ justifyContent: "space-between", padding: ".5rem !important" }}
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

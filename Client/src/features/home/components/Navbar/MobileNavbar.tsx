import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";

import { NavbarLeft } from "./NavbarLeft";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -0.5rem;
    right: 0rem;
  }
`;

type MobileNavbarProps = {
  onMenuClick: () => void;
  onSearchClick: () => void;
};

export function MobileNavbar({ onMenuClick, onSearchClick }: MobileNavbarProps) {
  return (
    <AppBar sx={{ height: { xs: "3.25rem", sm: "3.75rem" } }}>
      <Toolbar
        variant="dense"
        sx={{ justifyContent: "space-between", padding: ".5rem !important" }}
      >
        <NavbarLeft onMenuClick={onMenuClick} />

        <Stack direction="row" alignItems="center">
          <IconButton onClick={onSearchClick}>
            <SearchIcon />
          </IconButton>

          <IconButton>
            <AccountCircleIcon style={{ fontSize: "2rem" }} />
            <CustomBadge badgeContent={2} color="primary" overlap="circular" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

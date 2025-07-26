import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";

import { Searchbar } from "../Searchbar/Searchbar";
import { LogoWithName } from "@/shared/components/Logo";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -0.5rem;
    right: 0rem;
  }
`;

type DesktopNavbarProps = {
  onMenuClick: () => void;
};

export function DesktopNavbar({ onMenuClick }: DesktopNavbarProps) {
  return (
    <AppBar position="sticky" sx={{ height: { xs: "3.25rem", sm: "3.75rem" } }}>
      <Toolbar
        variant="dense"
        sx={{ justifyContent: "space-between", padding: ".5rem !important" }}
      >
        <Stack direction="row" alignItems="center">
          <IconButton size="large" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
          <Button
            variant="text"
            sx={{
              "&:hover": {
                background: "none",
              },
            }}
          >
            <LogoWithName size="medium" />
          </Button>
        </Stack>

        <Searchbar />

        <Stack direction="row" alignItems="center">
          <Button
            variant="text"
            startIcon={<AddIcon />}
            sx={{
              color: "white",
              borderRadius: "2rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#ffffff0d",
              },
            }}
          >
            Create
          </Button>

          <IconButton size="large">
            <ChatIcon />
            <CustomBadge badgeContent={2} color="primary" overlap="circular" />
          </IconButton>

          <IconButton>
            <AccountCircleIcon style={{ fontSize: "2rem" }} />
            <CustomBadge badgeContent={10} color="primary" overlap="circular" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

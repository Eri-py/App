import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import Button from "@mui/material/Button";
import ChatIcon from "@mui/icons-material/Chat";

import { LogoWithName } from "@/shared/components/Logo";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -0.5rem;
    right: 0rem;
  }
`;

type MobileNavbarProps = {
  onSearchClick: () => void;
  isAuthenticated: boolean;
};

export function MobileNavbar({ onSearchClick }: MobileNavbarProps) {
  return (
    <AppBar position="sticky" sx={{ height: "3.25rem" }}>
      <Toolbar
        variant="dense"
        sx={{ justifyContent: "space-between", padding: ".5rem !important" }}
      >
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

        <Stack direction="row" alignItems="center">
          <IconButton onClick={onSearchClick}>
            <SearchIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
            <CustomBadge badgeContent={2} color="primary" overlap="circular" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

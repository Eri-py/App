import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import Button from "@mui/material/Button";
import ChatIcon from "@mui/icons-material/Chat";

import { LogoWithName } from "@/shared/components/Logo";
import { useAuth } from "@/features/app/hooks/useAuth";
import { NavbarContainer } from "../components/NavbarContainer";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -0.5rem;
    right: 0rem;
  }
`;

type MobileNavbarProps = {
  onSearchClick: () => void;
};

export function MobileNavbar({ onSearchClick }: MobileNavbarProps) {
  const { isAuthenticated } = useAuth();

  return (
    <NavbarContainer>
      <Toolbar
        variant="dense"
        sx={{ justifyContent: "space-between", paddingInline: "0.25rem !important" }}
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

          {isAuthenticated && (
            <IconButton>
              <ChatIcon />
              <CustomBadge badgeContent={2} color="primary" overlap="circular" />
            </IconButton>
          )}
        </Stack>
      </Toolbar>
    </NavbarContainer>
  );
}

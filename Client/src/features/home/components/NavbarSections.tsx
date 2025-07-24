import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";

import { LogoWithName } from "../../../components/Logo";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -0.5rem;
    right: 0rem;
  }
`;

// Left side remains the same
type LeftButtonGroupProps = {
  onMenuClick: () => void;
};

export const LeftButtonGroup = ({ onMenuClick }: LeftButtonGroupProps) => {
  return (
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
  );
};

export const DesktopRightButtons = () => {
  return (
    <Stack direction="row" gap={{ sm: "0rem", md: "0.75rem" }}>
      {/* Create button */}
      <Button
        variant="text"
        startIcon={<AddIcon />}
        sx={{
          color: "white",
          borderRadius: "2rem",
          padding: "0rem 1rem",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "#ffffff0d",
          },
        }}
      >
        Create
      </Button>

      {/* Messages icon */}
      <IconButton size="large">
        <ChatIcon />
        <CustomBadge badgeContent={10} color="primary" overlap="circular" />
      </IconButton>

      {/* Notification icon */}
      <IconButton size="large">
        <NotificationsIcon />
        <CustomBadge badgeContent={2} color="primary" overlap="circular" />
      </IconButton>

      {/* Account icon */}
      <IconButton>
        <AccountCircleIcon style={{ fontSize: "2rem" }} />
      </IconButton>
    </Stack>
  );
};

type MobileRightButtonsProps = {
  onSearchClick: () => void;
};

export const MobileRightButtons = ({ onSearchClick }: MobileRightButtonsProps) => {
  return (
    <Stack direction="row">
      {/* Search icon */}
      <IconButton onClick={onSearchClick}>
        <SearchIcon />
      </IconButton>

      {/* Account icon */}
      <IconButton>
        <AccountCircleIcon style={{ fontSize: "2rem" }} />
        <CustomBadge badgeContent={2} color="primary" overlap="circular" />
      </IconButton>
    </Stack>
  );
};

import type { ReactNode } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: 0px;
  }
`;

// Left side remains the same
type LeftButtonGroupProps = {
  children: ReactNode;
  onMenuClick: () => void;
};

export const LeftButtonGroup = ({ children, onMenuClick }: LeftButtonGroupProps) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="large" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Button
        variant="text"
        sx={{
          marginLeft: { xs: -1.5, sm: 0 },
          "&:hover": {
            background: "none",
          },
        }}
      >
        {children}
      </Button>
    </Stack>
  );
};

export const DesktopRightButtons = () => {
  return (
    <Stack direction="row" gap={0.75}>
      {/* Create button */}
      <Button
        variant="text"
        startIcon={<AddIcon />}
        sx={{
          color: "white",
          borderRadius: 8,
          padding: "0rem 1rem",
          fontSize: 16,
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
        <AccountCircleIcon style={{ fontSize: 35 }} />
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

      {/* Create button */}
      <IconButton>
        <AddIcon />
      </IconButton>

      {/* Messages icon */}
      <IconButton size="medium">
        <ChatIcon />
        <CustomBadge badgeContent={10} color="primary" overlap="circular" />
      </IconButton>

      {/* Notification icon */}
      <IconButton size="medium">
        <NotificationsIcon />
        <CustomBadge badgeContent={2} color="primary" overlap="circular" />
      </IconButton>

      {/* Account icon */}
      <IconButton>
        <AccountCircleIcon style={{ fontSize: 30 }} />
      </IconButton>
    </Stack>
  );
};

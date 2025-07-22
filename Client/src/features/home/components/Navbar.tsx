import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge, { badgeClasses } from "@mui/material/Badge";

import { Logo, LogoWithName } from "../../../components/Logo";

export function Navbar() {
  const theme = useTheme();
  const isSmOrLarger = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <AppBar sx={{ padding: 0.25 }}>
      <Toolbar
        variant="dense"
        sx={{
          justifyContent: "space-between",
          gap: 3,
          paddingInline: { xs: 0.75 },
          paddingBlock: { xs: 0.5, sm: 0.75 },
        }}
      >
        <LeftToolBar isSmOrLarger={isSmOrLarger} />
        <CenterToolBar isSmOrLarger={isSmOrLarger} />
        <RightToolBar isSmOrLarger={isSmOrLarger} />
      </Toolbar>
    </AppBar>
  );
}

type ToolBarProps = {
  isSmOrLarger: boolean;
};

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: 0px;
  }
`;

const LeftToolBar = ({ isSmOrLarger }: ToolBarProps) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="large">
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
        {isSmOrLarger ? <LogoWithName size="medium" /> : <Logo width="27px" />}
      </Button>
    </Stack>
  );
};

const CenterToolBar = ({ isSmOrLarger }: ToolBarProps) => {
  return (
    isSmOrLarger && (
      <Stack component="form" direction="row" flex={1} maxWidth={720}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          autoComplete="off"
          slotProps={{
            root: {
              sx: { flex: 1 },
            },
            input: {
              startAdornment: <SearchIcon />,
              sx: { borderRadius: 8, gap: 1 },
            },
          }}
        />
      </Stack>
    )
  );
};

const RightToolBar = ({ isSmOrLarger }: ToolBarProps) => {
  return (
    <Stack direction="row" gap={{ sm: 0.75 }}>
      {/*Messages icon*/}
      <IconButton size={isSmOrLarger ? "large" : "medium"}>
        <ChatIcon />
      </IconButton>

      {/*Search icon for mobile*/}
      {!isSmOrLarger && (
        <IconButton>
          <SearchIcon />
        </IconButton>
      )}

      {/*Create button*/}
      {isSmOrLarger ? (
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
      ) : (
        <IconButton>
          <AddIcon />
        </IconButton>
      )}

      {/*Notification icons*/}
      <IconButton size={isSmOrLarger ? "large" : "medium"}>
        <NotificationsIcon />
        <CustomBadge badgeContent={2} color="primary" overlap="circular" />
      </IconButton>

      {/*Account icon*/}
      <IconButton>
        <AccountCircleIcon style={{ fontSize: isSmOrLarger ? 35 : 30 }} />
      </IconButton>
    </Stack>
  );
};

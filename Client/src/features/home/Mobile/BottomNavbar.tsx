import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
// import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useNavigationButtons } from "../hooks/useNavigationButtons";
import Stack from "@mui/material/Stack";
// import Badge, { badgeClasses } from "@mui/material/Badge";
// import { styled } from "@mui/material/styles";

// const CustomBadge = styled(Badge)`
//   & .${badgeClasses.badge} {
//     top: -0.5rem;
//     right: 0rem;
//   }
// `;

export function BottomNavbar() {
  const { handleMessagesClick, handleProfileClick } = useNavigationButtons();

  return (
    <Stack
      direction="row"
      component="footer"
      height="3rem"
      justifyContent="space-between"
      position="sticky"
      sx={{
        border: "1px solid black",
        backgroundColor: "background.default",
        bottom: 0,
        left: 0,
      }}
    >
      <IconButton size="large" onClick={handleMessagesClick}>
        <ChatIcon />
      </IconButton>

      <IconButton onClick={handleProfileClick}>
        <AccountCircleIcon style={{ fontSize: "2rem" }} />
      </IconButton>

      <IconButton size="large" onClick={handleMessagesClick}>
        <ChatIcon />
      </IconButton>

      <IconButton onClick={handleProfileClick}>
        <AccountCircleIcon style={{ fontSize: "2rem" }} />
      </IconButton>

      <IconButton size="large" onClick={handleMessagesClick}>
        <ChatIcon />
      </IconButton>
    </Stack>
  );
}

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useNavigationButtons } from "../hooks/useNavigationButtons";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
// import Badge, { badgeClasses } from "@mui/material/Badge";
// import { styled } from "@mui/material/styles";

// const CustomBadge = styled(Badge)`
//   & .${badgeClasses.badge} {
//     top: -0.5rem;
//     right: 0rem;
//   }
// `;

export function BottomNavbar() {
  const theme = useTheme();
  const { handleCreateClick, handleProfileClick } = useNavigationButtons();

  return (
    <Stack
      direction="row"
      component="footer"
      height="3rem"
      justifyContent="space-between"
      position="sticky"
      sx={{
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        backgroundColor: "background.default",
        bottom: 0,
        left: 0,
      }}
    >
      <IconButton size="large">
        <HomeIcon style={{ fontSize: "1.75rem" }} />
      </IconButton>

      <IconButton size="large">
        <AutoAwesomeIcon style={{ fontSize: "1.75rem" }} />
      </IconButton>

      <IconButton size="large" onClick={handleCreateClick}>
        <AddIcon style={{ fontSize: "1.75rem" }} />
      </IconButton>

      <IconButton size="large">
        <StorefrontIcon style={{ fontSize: "1.75rem" }} />
      </IconButton>

      <IconButton size="large" onClick={handleProfileClick}>
        <AccountCircleIcon style={{ fontSize: "1.75rem" }} />
      </IconButton>
    </Stack>
  );
}

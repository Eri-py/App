import type { ReactElement } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListItemIcon from "@mui/material/ListItemIcon";

type SidebarProps = {
  isOpen: boolean;
};

const xxx: { label: string; icon: ReactElement }[] = [
  { label: "Home", icon: <HomeIcon /> },
  { label: "Show & tell", icon: <AutoAwesomeIcon /> },
  { label: "Trade", icon: <StorefrontIcon /> },
  { label: "Create post", icon: <AddIcon /> },
  { label: "Profile", icon: <AccountCircleIcon /> },
];

// TODO: Implement proper sidebar
// Split collapsed and seprated into seprate components
export function Sidebar({ isOpen }: SidebarProps) {
  const yyy = xxx.map((x) => {
    if (!isOpen) {
      return (
        <ListItemButton
          sx={{
            borderRadius: "0.75rem",
          }}
        >
          <ListItemText
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxHeight: "3.5rem",

              "& .MuiListItemText-secondary": {
                textAlign: "center",
                fontSize: "0.75rem",
              },
            }}
            primary={x.icon}
            secondary={x.label}
          />
        </ListItemButton>
      );
    }

    return (
      <ListItemButton
        selected={x.label === "Home"}
        sx={{
          borderRadius: "0.5rem",
          gap: "1rem",
          height: "2.5rem",
        }}
      >
        <ListItemIcon sx={{ minWidth: "fit-content" }}>{x.icon}</ListItemIcon>
        <ListItemText primary={x.label} />
      </ListItemButton>
    );
  });

  return (
    <Stack
      width={isOpen ? "18.75rem" : "5.5rem"}
      sx={{ borderRight: "1px solid rgba(21, 101, 192, .5)", paddingInline: "0.5rem" }}
    >
      <List>{yyy}</List>
    </Stack>
  );
}

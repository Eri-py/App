import { useState, type ReactElement } from "react";
import { styled } from "@mui/material/styles";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import EventIcon from "@mui/icons-material/Event";

const navigationItems: { label: string; icon: ReactElement }[] = [
  { label: "Home", icon: <HomeIcon /> },
  { label: "Show & tell", icon: <AutoAwesomeIcon /> },
  { label: "Trade", icon: <StorefrontIcon /> },
  { label: "Events", icon: <EventIcon /> },
];

const hobbiesList = [
  "Vintage Baseball Cards",
  "Comic Book Collecting",
  "Coin Collecting",
  "Stamp Collecting",
  "Model Trains",
  "Pokemon Cards",
];

const NavigationButton = styled(ListItemButton)({
  borderRadius: "0.5rem",
  gap: "0.75rem",
  height: "2.5rem",
});

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: "fit-content",
});

const StyledExpandedPrimary = styled(ListItemText)({
  "& .MuiListItemText-primary": {
    fontSize: "0.95rem",
    fontWeight: 300,
  },
});

type SidebarProps = {
  isOpen: boolean;
};

export function Sidebar({ isOpen }: SidebarProps) {
  const [hobbiesExpanded, setHobbiesExpanded] = useState<boolean>(true);

  const handleHobbiesToggle = () => {
    setHobbiesExpanded(!hobbiesExpanded);
  };

  const navigationElements = navigationItems.map((item) => {
    if (!isOpen) {
      return (
        <ListItemButton
          key={item.label}
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
            primary={item.icon}
            secondary={item.label}
          />
        </ListItemButton>
      );
    }

    return (
      <NavigationButton key={item.label}>
        <StyledListItemIcon>{item.icon}</StyledListItemIcon>
        <StyledExpandedPrimary primary={item.label} />
      </NavigationButton>
    );
  });

  return (
    <Stack
      width={isOpen ? "18.75rem" : "5.5rem"}
      sx={{
        borderRight: "1px solid rgba(21, 101, 192, .5)",
        paddingInline: "0.5rem",
      }}
    >
      <List>
        {navigationElements}
        {isOpen && (
          <>
            <Divider />
            <NavigationButton sx={{ marginTop: "1rem" }} onClick={handleHobbiesToggle}>
              <ListItemText secondary="HOBBIES" />
              {hobbiesExpanded ? <ExpandLess /> : <ExpandMore />}
            </NavigationButton>
            <Collapse in={hobbiesExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {hobbiesList.map((hobby) => (
                  <NavigationButton key={hobby}>
                    <StyledExpandedPrimary primary={hobby} />
                  </NavigationButton>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </List>
    </Stack>
  );
}

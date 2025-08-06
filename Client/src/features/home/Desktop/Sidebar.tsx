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
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useThemeToggle } from "@/shared/hooks/useThemeToggle";

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

const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 78,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(4px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(40px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

type SidebarProps = {
  isOpen: boolean;
};

export function Sidebar({ isOpen }: SidebarProps) {
  const [hobbiesExpanded, setHobbiesExpanded] = useState<boolean>(true);
  const { mode, toggleTheme } = useThemeToggle();

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
      justifyContent="space-between"
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
      <Stack component="footer" paddingBottom="1rem">
        <FormControlLabel
          control={<ThemeSwitch sx={{ m: 1 }} />}
          checked={mode === "dark"}
          onChange={() => {
            toggleTheme();
          }}
          label={isOpen ? "Toggle theme" : ""}
          slotProps={{
            typography: {
              sx: {
                fontWeight: 300,
              },
            },
          }}
        />
      </Stack>
    </Stack>
  );
}

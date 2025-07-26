import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

type SidebarProps = {
  isOpen: boolean;
};

// TODO: Implement proper sidebar
// Split collapsed and seprated into seprate components
export function Sidebar({ isOpen }: SidebarProps) {
  console.log(isOpen);

  return isOpen ? (
    // Sidebar expanded
    <Stack width={200} sx={{ borderRight: "1px solid rgba(21, 101, 192, .5)" }}>
      <List dense>
        <ListItemButton>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Show and tell" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Create post" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Trading" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>
      <Divider />
    </Stack>
  ) : (
    // Sidebar collapsed
    <Stack width={90} sx={{ borderRight: "1px solid rgba(21, 101, 192, .5)" }}>
      <List dense>
        <ListItemButton>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Show and tell" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Create post" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Trading" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>
      <Divider />
    </Stack>
  );
}

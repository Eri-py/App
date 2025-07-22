import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

import { LogoWithName } from "../../../components/Logo";

export function Navbar() {
  const theme = useTheme();
  console.log(theme.components?.MuiAppBar?.defaultProps);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ paddingBlock: 0.5 }}>
        <Toolbar
          variant="dense"
          sx={{ justifyContent: "space-between", backgroundColor: "transparent" }}
        >
          <LeftToolBar />
          <CenterToolBar />
          <RightToolBar />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const LeftToolBar = () => {
  return (
    <Stack direction="row" gap={2} alignItems="center">
      <IconButton size="large">
        <MenuIcon />
      </IconButton>
      <LogoWithName size="medium" />
    </Stack>
  );
};
const CenterToolBar = () => {
  return (
    <Stack direction="row" gap={2} alignItems="center">
      This is the center
    </Stack>
  );
};
const RightToolBar = () => {
  return (
    <Stack direction="row" gap={2} alignItems="center">
      This is the right
    </Stack>
  );
};

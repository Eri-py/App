import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";

const LeftToolBar = () => {
  return <Stack>This is the left</Stack>;
};
const CenterToolBar = () => {
  return <Stack>This is the center</Stack>;
};
const RightToolBar = () => {
  return <Stack>This is the right</Stack>;
};

export function Navbar() {
  const theme = useTheme();
  console.log(theme.components?.MuiAppBar?.defaultProps);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
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

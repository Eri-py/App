import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { SearchInput } from "./Searchbar/SearchInput";

type MobileSearchModeProps = { onBack: () => void };

export const MobileSearchMode = ({ onBack }: MobileSearchModeProps) => (
  <>
    <AppBar position="sticky" sx={{ height: "3.25rem" }}>
      <Toolbar
        variant="dense"
        sx={{ justifyContent: "space-between", padding: ".5rem !important" }}
      >
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <form style={{ display: "flex", flex: 1 }}>
          <SearchInput isPending={false} flex={1} autoFocus />
        </form>
      </Toolbar>
    </AppBar>
  </>
);

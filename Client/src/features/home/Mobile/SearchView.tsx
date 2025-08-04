import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Toolbar from "@mui/material/Toolbar";

import { SearchInput } from "../components/SearchInput";
import { NavbarContainer } from "../components/NavbarContainer";

type MobileSearchModeProps = { onBack: () => void };

export const MobileSearchMode = ({ onBack }: MobileSearchModeProps) => (
  <>
    <NavbarContainer>
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
    </NavbarContainer>
  </>
);

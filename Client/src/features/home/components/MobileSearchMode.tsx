import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

type MobileSearchModeProps = { onBack: () => void };

export const MobileSearchMode = ({ onBack }: MobileSearchModeProps) => (
  <>
    <AppBar position="sticky" sx={{ height: { xs: "3.25rem", sm: "3.75rem" } }}>
      <Toolbar
        variant="dense"
        sx={{ justifyContent: "space-between", padding: ".5rem !important" }}
      >
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <TextField
          component="form"
          variant="outlined"
          size="small"
          name="search"
          placeholder="Search..."
          autoFocus={true}
          sx={{ flex: 1, maxWidth: "31.25rem" }}
          slotProps={{
            input: {
              startAdornment: (
                <IconButton disableRipple type="submit">
                  <SearchIcon />
                </IconButton>
              ),
              sx: { borderRadius: "2rem" },
            },
          }}
        />
      </Toolbar>
    </AppBar>
  </>
);

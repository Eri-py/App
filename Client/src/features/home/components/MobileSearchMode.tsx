import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

import TextField from "@mui/material/TextField";

type MobileSearchModeProps = { onBack: () => void };

export const MobileSearchMode = ({ onBack }: MobileSearchModeProps) => (
  <>
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
      sx={{ flex: 1, maxWidth: 500 }}
      slotProps={{
        input: {
          startAdornment: (
            <IconButton disableRipple type="submit">
              <SearchIcon />
            </IconButton>
          ),
          sx: { borderRadius: 8 },
        },
      }}
    />
  </>
);

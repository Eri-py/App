import TextField, { type TextFieldProps } from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

export const SearchBox = ({ ...props }: TextFieldProps) => {
  return (
    <TextField
      {...props}
      component="form"
      variant="outlined"
      size="small"
      name="search"
      sx={{ flex: 1 }}
      slotProps={{
        input: {
          startAdornment: (
            <IconButton disableRipple type="submit">
              <SearchIcon />
            </IconButton>
          ),
          sx: { borderRadius: 8 },
        },
        htmlInput: { autoComplete: "off", placeholder: "Search..." },
      }}
    />
  );
};

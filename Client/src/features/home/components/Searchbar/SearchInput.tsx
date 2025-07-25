import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { type AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

type SearchInputProps = {
  params?: AutocompleteRenderInputParams;
  autoFocus?: boolean;
};

export const SearchInput = ({ params, autoFocus }: SearchInputProps) => {
  return (
    <TextField
      {...params}
      component="form"
      variant="outlined"
      name="search"
      placeholder="Search..."
      autoFocus={autoFocus ?? false}
      slotProps={{
        input: {
          ...params?.InputProps,
          startAdornment: (
            <IconButton disableRipple type="submit">
              <SearchIcon />
            </IconButton>
          ),
          sx: { borderRadius: "2rem", height: "2.5rem" },
        },
      }}
    />
  );
};

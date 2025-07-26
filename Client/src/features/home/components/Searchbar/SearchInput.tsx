import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { type AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

type SearchInputProps = {
  params?: AutocompleteRenderInputParams;
  autoFocus?: boolean;
  isPending: boolean;
};

export const SearchInput = ({ params, autoFocus, isPending }: SearchInputProps) => {
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
          endAdornment: isPending ? <CircularProgress size="20px" sx={{ padding: 0 }} /> : null,
          sx: { borderRadius: "2rem", height: "2.5rem", padding: "0.75rem !important" },
        },
      }}
    />
  );
};

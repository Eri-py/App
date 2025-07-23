import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { testSearchResult } from "./testSearchResult";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

type SearchbarProps = {
  autoFocus?: boolean;
};

const options = testSearchResult.map((option) => option.title);

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [inputValue, setInputValue] = useState("");

  console.log(inputValue);

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      sx={{ width: 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          component="form"
          variant="outlined"
          size="small"
          name="search"
          placeholder="Search..."
          autoFocus={autoFocus}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <IconButton disableRipple type="submit">
                  <SearchIcon />
                </IconButton>
              ),
              sx: { borderRadius: 8 },
            },
          }}
        />
      )}
    />
  );
}

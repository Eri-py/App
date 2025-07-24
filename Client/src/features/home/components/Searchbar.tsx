import { useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import { testSearchResult, testSearchHistory } from "./testSearchResults";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [inputValue, setInputValue] = useState("");

  const searchResultOptions = testSearchResult.map((option) => option.name);
  const searchHistoryOptions = testSearchHistory.map((option) => option.name);

  console.log(inputValue);

  return (
    <Autocomplete
      freeSolo
      options={inputValue.length === 0 ? searchHistoryOptions : searchResultOptions}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      sx={{ flex: 1, maxWidth: "31rem" }}
      renderInput={(params) => (
        <TextField
          {...params}
          component="form"
          variant="outlined"
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
              sx: { borderRadius: "2rem", height: "2.5rem" },
            },
          }}
        />
      )}
    />
  );
}

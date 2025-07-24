import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { testSearchHistory } from "../testSearchResults";
import { SearchInput, SearchOptionItem, SearchGroup, type SearchOption } from "./SearchInput";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<SearchOption[]>(testSearchHistory);

  const handleOptionRemove = (optionToRemove: SearchOption) => {
    setOptions((prevOptions) => {
      return prevOptions.filter((item) => item !== optionToRemove);
    });
  };

  return (
    <Autocomplete
      freeSolo
      blurOnSelect={false}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option.name;
      }}
      groupBy={(option) => option.category}
      renderGroup={(params) => (
        <SearchGroup groupKey={params.key} groupName={params.group} inputValue={inputValue}>
          {params.children}
        </SearchGroup>
      )}
      renderOption={(props, option) => (
        <SearchOptionItem props={props} option={option} onRemove={handleOptionRemove} />
      )}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => <SearchInput params={params} autoFocus={autoFocus} />}
      sx={{ flex: 1, maxWidth: "31rem" }}
      slotProps={{
        listbox: { sx: { overflow: "hidden", paddingInline: "0.25rem" } },
      }}
    />
  );
}

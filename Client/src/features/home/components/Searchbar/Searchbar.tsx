import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { testSearchHistory, testSearchResult } from "../testSearchResults";
import { SearchInput, SearchOptionItem, SearchGroup, type SearchOption } from "./SearchInput";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<SearchOption[]>(testSearchHistory);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchResult, setSearchResult] = useState<SearchOption[]>(testSearchResult);

  const handleOptionRemove = (optionToRemove: SearchOption) => {
    setSearchHistory((prevOptions) => prevOptions.filter((item) => item !== optionToRemove));
  };

  return (
    <Autocomplete
      freeSolo
      options={inputValue.length > 0 ? searchResult : searchHistory}
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
      renderOption={(props, option) => {
        if (inputValue.length > 0) {
          return <SearchOptionItem props={props} option={option} />;
        }
        return <SearchOptionItem props={props} option={option} onRemove={handleOptionRemove} />;
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => <SearchInput params={params} autoFocus={autoFocus} />}
      sx={{ flex: 1, maxWidth: "31rem" }}
      slotProps={{
        listbox: {
          sx: {
            overflow: "hidden",
            paddingInline: "0.25rem",
            minHeight: "fit-content",
          },
        },
        popper: {
          placement: "bottom-end",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 3],
              },
            },
            {
              name: "matchReferenceWidth",
              enabled: true,
              phase: "beforeWrite",
              requires: ["computeStyles"],
              fn: ({ state }) => {
                state.styles.popper.width = `${state.rects.reference.width}px`;
              },
            },
          ],
        },
      }}
    />
  );
}

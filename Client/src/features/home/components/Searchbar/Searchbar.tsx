import type { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import Autocomplete from "@mui/material/Autocomplete";

import { SearchInput } from "./SearchInput";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { testSearchHistory, testSearchResult } from "../testSearchResults";
import { getSearchResults, type getSearchResultsResponse } from "@/api/HomeApi";
import { type SearchOption, SearchGroup, SearchOptionItem } from "./SearchOptions";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<SearchOption[]>(testSearchHistory);
  const [searchResult, setSearchResult] = useState<SearchOption[]>([]);
  const debouncedSearchQuery = useDebounce(inputValue);

  const handleOptionRemove = (optionToRemove: SearchOption) => {
    setSearchHistory((prevOptions) => prevOptions.filter((item) => item !== optionToRemove));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (query: string) => getSearchResults(query),
    onSuccess: (response: AxiosResponse<getSearchResultsResponse>) => {
      setSearchResult(response.data);
    },
    onError: (error) => {
      console.log(error);
      setSearchResult(testSearchResult);
    },
  });

  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      setSearchResult([]);
      mutate(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, mutate]);

  return (
    <Autocomplete
      freeSolo
      options={debouncedSearchQuery.length > 0 ? searchResult : searchHistory}
      filterOptions={(options) => options}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option.name;
      }}
      groupBy={(option) => option.category}
      renderGroup={(params) => (
        <SearchGroup
          groupKey={params.key}
          groupName={params.group}
          inputValue={debouncedSearchQuery}
        >
          {params.children}
        </SearchGroup>
      )}
      renderOption={(props, option) => {
        if (debouncedSearchQuery.length > 0) {
          return <SearchOptionItem props={props} option={option} />;
        }
        return <SearchOptionItem props={props} option={option} onRemove={handleOptionRemove} />;
      }}
      renderInput={(params) => (
        <SearchInput params={params} autoFocus={autoFocus} isPending={isPending} />
      )}
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

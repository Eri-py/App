import type { AxiosResponse } from "axios";
import { useState, useEffect, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import Autocomplete from "@mui/material/Autocomplete";

import { SearchInput } from "./SearchInput";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { testSearchHistory } from "../testSearchResults";
import {
  getSearchResult,
  type getSearchResultRequest,
  type getSearchResultsResponse,
} from "@/api/HomeApi";
import { type SearchOption, SearchGroup, SearchOptionItem } from "./SearchOptions";
import { useNavigate } from "@tanstack/react-router";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<SearchOption[]>(testSearchHistory);
  const [searchResult, setSearchResult] = useState<SearchOption[]>([]);
  const debouncedSearchQuery = useDebounce(inputValue);
  const navigate = useNavigate();

  const handleOptionRemove = (optionToRemove: SearchOption) => {
    setSearchHistory((prevOptions) => prevOptions.filter((item) => item !== optionToRemove));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: getSearchResultRequest) => getSearchResult(data),
    onSuccess: (response: AxiosResponse<getSearchResultsResponse>) =>
      setSearchResult(response.data),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = new FormData(e.currentTarget).get("search") as string;
    navigate({ to: "/search", search: { q: query } });
  };

  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      mutate({ query: debouncedSearchQuery });
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
        <form onSubmit={handleSubmit}>
          <SearchInput params={params} autoFocus={autoFocus} isPending={isPending} />
        </form>
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

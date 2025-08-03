import type { AxiosResponse } from "axios";
import { useState, useEffect, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import Autocomplete from "@mui/material/Autocomplete";

import {
  getSearchHistory,
  getSearchResult,
  updateSearchHistory,
  type getSearchResultRequest,
  type getSearchResultsResponse,
} from "@/api/HomeApi";
import {
  type SearchOption,
  AutoCompleteGroup,
  AutoCompleteOptionItem,
} from "./AutoCompleteComponents";
import { useNavigate } from "@tanstack/react-router";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { SearchInput } from "../components/SearchInput";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<SearchOption[]>([]);
  const [searchResult, setSearchResult] = useState<SearchOption[]>([]);
  const debouncedSearchQuery = useDebounce(inputValue);
  const navigate = useNavigate();

  // Get user search history on page load.
  const { data } = useQuery({
    queryKey: ["userSearches"],
    queryFn: getSearchHistory,
  });
  useEffect(() => {
    const dataAsSearchOptions = data?.data.result.map((term: string) => ({
      name: term,
      category: "Recent searches",
    }));

    setSearchHistory(dataAsSearchOptions);
  }, [data]);

  const handleOptionRemove = (optionToRemove: SearchOption) => {
    setSearchHistory((prevOptions) => prevOptions.filter((item) => item !== optionToRemove));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: getSearchResultRequest) => getSearchResult(data),
    onSuccess: (response: AxiosResponse<getSearchResultsResponse>) =>
      setSearchResult(response.data.result),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Redirect to search results page.
    const query = new FormData(e.currentTarget).get("search") as string;
    navigate({ to: "/search", search: { q: query } });

    // Update the user search history based off the state of searchHistory
    const searchTerms = searchHistory.map((term) => term.name);
    updateSearchHistory({ searchTerms: [...searchTerms, query] });
  };

  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      mutate({ query: debouncedSearchQuery });
    }
  }, [debouncedSearchQuery, mutate]);

  return (
    <>
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
          <AutoCompleteGroup
            groupKey={params.key}
            groupName={params.group}
            inputValue={debouncedSearchQuery}
          >
            {params.children}
          </AutoCompleteGroup>
        )}
        renderOption={(props, option) => {
          if (debouncedSearchQuery.length > 0) {
            return <AutoCompleteOptionItem props={props} option={option} />;
          }
          return (
            <AutoCompleteOptionItem props={props} option={option} onRemove={handleOptionRemove} />
          );
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
    </>
  );
}

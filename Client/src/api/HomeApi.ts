import { apiClient } from "./Client";

export type getSearchResultsResponse = { result: { name: string; category: string }[] };

export type getSearchResultRequest = { query: string };

export type updateSearchHistoryRequest = { searchTerms: string[] };

export const getSearchResult = (data: getSearchResultRequest) => {
  return apiClient.post("home/search-results", data);
};

export const updateSearchHistory = (data: updateSearchHistoryRequest) => {
  return apiClient.post("home/update-search-history", data);
};

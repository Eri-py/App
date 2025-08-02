import { apiClient } from "./Client";

export type getSearchResultsResponse = { name: string; category: string }[];

export type getSearchResultRequest = { query: string };

export const getSearchResult = (data: getSearchResultRequest) => {
  return apiClient.post("home/search-results", data);
};

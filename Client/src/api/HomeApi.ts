import { apiClient } from "./Client";

export type getSearchResultsResponse = { name: string; category: string }[];

export const getSearchResults = (data: string) => {
  return apiClient.post("home/search-results", data);
};

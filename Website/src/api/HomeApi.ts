import { apiClient } from "./Client";

export type getSearchSuggestionsResponse = { result: { name: string; category: string }[] };

export type getSearchSuggestionsRequest = { query: string };

export type addOrUpdateSearchTermRequest = { searchTerm: string };

export type removeSearchTermsRequest = { searchTerms: string[] };

export const getSearchSuggestions = (data: getSearchSuggestionsRequest) => {
  return apiClient.post("home/search-suggestions", data);
};

export const getSearchHistory = () => {
  return apiClient.get("home/get-search-history");
};

export const addOrUpdateSearchTerm = (data: addOrUpdateSearchTermRequest) => {
  return apiClient.post("home/add-search-term", data);
};

export const removeSearchTerms = (data: removeSearchTermsRequest) => {
  return apiClient.post("home/remove-search-terms", data);
};

export const getUserHobbies = () => {
  return apiClient.get("home/get-user-hobbies");
};

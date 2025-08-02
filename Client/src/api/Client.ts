import axios, { AxiosError } from "axios";
import { getNewAccessToken } from "./AuthApi";

const API_BASE_URL = "https://localhost:7000/api"; //Remember to change this back to localhost before commits

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  if (error.status === 401) {
    try {
      await getNewAccessToken(); // Try to get a new accessToken.
      return apiClient.request(error.config!);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

import axios, { AxiosError } from "axios";
import { refreshToken } from "./AuthApi";

const API_BASE_URL = "https://localhost:7000/api"; //Remember to change this back to localhost before commits

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  if (error.status === 401) {
    try {
      await refreshToken();
      console.log("Successful");
      // return apiClient.request(error.config!);
      return Promise.reject(error);
    } catch {
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});

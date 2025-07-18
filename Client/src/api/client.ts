import axios from "axios";
import { AxiosError } from "axios";

const API_BASE_URL = "https://localhost:7000/api"; //Remember to change this back to localhost before commits

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Define accepted shapes for response.data
type ServerErrorResponse = {
  message?: string;
};

export type ServerError = AxiosError<ServerErrorResponse>;

export function getErrorMessage(error: ServerError): string {
  if (error.response && error.response.data) {
    const data = error.response.data;

    // shape returned from API controllers
    if (data.message && typeof data.message === "string") {
      return data.message;
    }
  }

  return "An unexpected error occurred.";
}

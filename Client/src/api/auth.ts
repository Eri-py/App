import { apiClient } from "./client";

// Registration
export const startRegisteration = (username: string, email: string) => {
  return apiClient.post("auth/register/start", { username, email });
};

export const verifyOtp = (username: string, email: string, otp: string) => {
  return apiClient.post("auth/register/verify-otp", { username, email, otp });
};

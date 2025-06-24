import { apiClient } from "./client";

// Registration
export const verifyRegistrationCredentials = (username: string, email: string) => {
  return apiClient.post("auth/register/verify-credentials", { username, email });
};

export const verifyOtp = (otp: string) => {
  return apiClient.post("auth/register/verify-otp", { otp });
};

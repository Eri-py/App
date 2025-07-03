import { apiClient } from "./Client";
import type {
  completeRegistrationRequest,
  startRegistrationRequest,
  verifyOtpRequest,
} from "./Dtos";

// Registration
export const startRegistration = (data: startRegistrationRequest) => {
  return apiClient.post("auth/register/start", data);
};

export const verifyOtp = (data: verifyOtpRequest) => {
  return apiClient.post("auth/register/verify-otp", data);
};

export const completeRegistration = (data: completeRegistrationRequest) => {
  return apiClient.post("auth/register/complete", data);
};

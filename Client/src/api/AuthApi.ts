import { apiClient } from "./Client";

// Registration Dtos
export type startRegistrationRequest = { username: string; email: string };

export type verifyOtpRequest = { email: string; otp: string };

export type completeRegistrationRequest = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
};

export type resendVerifcationCodeRequest = { identifier: string };

// Login Dtos
export type loginRequest = { identifier: string; password: string };

// Registration Api calls
export const startRegistration = (data: startRegistrationRequest) => {
  return apiClient.post("auth/register/start", data);
};

export const verifyOtp = (data: verifyOtpRequest) => {
  return apiClient.post("auth/register/verify-otp", data);
};

export const completeRegistration = (data: completeRegistrationRequest) => {
  return apiClient.post("auth/register/complete", data);
};

export const resendVerifcationCode = (data: resendVerifcationCodeRequest) => {
  return apiClient.post("auth/resend-verification-code", data);
};

// Login Api calls
export const startLogin = (data: loginRequest) => {
  return apiClient.post("auth/login/start", data);
};

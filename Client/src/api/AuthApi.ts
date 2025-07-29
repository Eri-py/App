import { apiClient } from "./Client";

// Registration Dtos
export type startRegistrationRequest = { username: string; email: string };

export type verifyOtpRegistrationRequest = { email: string; otp: string };

export type completeRegistrationRequest = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
};

export type resendVerificationCodeRequest = { identifier: string };

// Login Dtos
export type startLoginRequest = { identifier: string; password: string };

export type startLoginResponse = { otpExpiresAt: string; email: string };

export type completeLoginRequest = { identifier: string; otp: string };

// Get user response
export type getUserResponse = {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
  } | null;
};

// Registration Api calls
export const startRegistration = (data: startRegistrationRequest) => {
  return apiClient.post("auth/register/start", data);
};

export const verifyOtpRegistration = (data: verifyOtpRegistrationRequest) => {
  return apiClient.post("auth/register/verify-otp", data);
};

export const completeRegistration = (data: completeRegistrationRequest) => {
  return apiClient.post("auth/register/complete", data);
};

export const resendVerificationCode = (
  data: resendVerificationCodeRequest,
  context: "login" | "register"
) => {
  return apiClient.post(`auth/${context}/resend-verification-code`, data);
};

// Login Api calls
export const startLogin = (data: startLoginRequest) => {
  return apiClient.post("auth/login/start", data);
};

export const completeLogin = (data: completeLoginRequest) => {
  return apiClient.post("auth/login/complete", data);
};

// User verification Api calls
export const getUserDetails = () => {
  return apiClient.get("auth/get-user-details");
};

export const refreshToken = () => {
  return apiClient.get("auth/refresh-token");
};

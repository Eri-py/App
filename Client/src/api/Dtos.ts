export type startRegistrationRequest = { username: string; email: string };

export type verifyOtpRequest = { username: string; email: string; otp: string };

export type completeRegistrationRequest = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
};

export type startRegistrationResponse = { otpExpiresAt: string };

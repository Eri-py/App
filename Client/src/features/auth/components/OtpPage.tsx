import { useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";
import Countdown, { zeroPad } from "react-countdown";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { parseISO } from "date-fns";

import { useTheme } from "@mui/material/styles";
import { MuiOtpInput } from "mui-one-time-password-input";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { type resendVerificationCodeRequest, resendVerificationCode } from "../../../api/AuthApi";
import { CustomFormHeader } from "./CustomInputs";

type OtpPageProps = {
  email: string;
  otpExpiresAt: string;
  isContinueDisabled: boolean;
  handleBack: () => void;
  isPending: boolean;
  onOtpExpiresAtUpdate: (newExpiresAt: string) => void;
  mode: "login" | "register";
  handleNext?: () => void;
};

export function OtpPage({
  email,
  otpExpiresAt,
  isContinueDisabled,
  handleBack,
  isPending,
  onOtpExpiresAtUpdate,
  mode,
  handleNext,
}: OtpPageProps) {
  const theme = useTheme();
  const { control } = useFormContext();

  const [endTime, setEndTime] = useState(parseISO(otpExpiresAt).getTime());
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const resendVerificationMutation = useMutation({
    mutationFn: (data: resendVerificationCodeRequest) => resendVerificationCode(data, mode),
    onSuccess: (response: AxiosResponse) => {
      const newExpiresAt = response.data;
      const newEndTime = parseISO(newExpiresAt).getTime();
      setEndTime(newEndTime);
      setIsResendDisabled(true);
      onOtpExpiresAtUpdate(newExpiresAt);
    },
  });

  const handleResend = async () => {
    await resendVerificationMutation.mutateAsync({ identifier: email });
  };

  return (
    <Stack gap="0.75rem" padding="1rem">
      <CustomFormHeader
        header="Verify email"
        subtext={
          <span>
            Enter the <b>6 digit code</b> sent to the email below <br />
            <b>{email?.toLowerCase()}.</b>
          </span>
        }
        align="flex-start"
      />

      <Controller
        name="otp"
        control={control}
        render={({ field: { value, onChange }, formState: { errors } }) => (
          <Stack>
            <MuiOtpInput
              value={value || ""}
              length={6}
              onChange={onChange}
              TextFieldsProps={{
                slotProps: {
                  htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
                },
              }}
            />
            {get(errors, "otp")?.message && (
              <FormHelperText error>{get(errors, "otp").message}</FormHelperText>
            )}
          </Stack>
        )}
      />

      <Countdown
        key={endTime}
        date={endTime}
        onStart={() => {
          setTimeout(
            () => {
              setIsResendDisabled(false);
            },
            (endTime - Date.now()) / 5
          );
        }}
        renderer={({ minutes, seconds, completed }) => {
          if (!completed) {
            return (
              <Typography
                fontSize="0.84375rem"
                color={theme.palette.text.secondary}
                textAlign="center"
              >
                Code expires in{" "}
                <b>
                  {zeroPad(minutes)}:{zeroPad(seconds)}
                </b>
              </Typography>
            );
          } else {
            return (
              <Typography fontSize="0.9375rem" color={theme.palette.error.main} textAlign="center">
                Code expired
              </Typography>
            );
          }
        }}
      />

      {!isResendDisabled && (
        <Typography fontSize="0.9375rem" color={theme.palette.text.secondary} alignSelf="center">
          Didn't get the Code?{" "}
          <Button
            type="button"
            variant="text"
            size="small"
            disabled={resendVerificationMutation.isPending}
            onClick={handleResend}
            sx={{
              padding: "0rem",
              width: "fit-content",
              textDecoration: "underline !important",
              "&:hover": {
                background: "none",
              },
            }}
          >
            Resend Code
          </Button>
        </Typography>
      )}

      <Button
        type={mode === "login" ? "submit" : "button"}
        size="large"
        variant="contained"
        onClick={mode === "register" ? handleNext : undefined}
        loading={isPending}
        disabled={isContinueDisabled}
      >
        {mode === "login" ? "Submit" : "Continue"}
      </Button>

      <Button variant="outlined" type="button" size="large" onClick={handleBack}>
        Back
      </Button>
    </Stack>
  );
}

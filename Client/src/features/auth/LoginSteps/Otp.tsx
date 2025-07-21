import { useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";
import Countdown, { zeroPad } from "react-countdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { parseISO } from "date-fns";

import { useTheme } from "@mui/material/styles";
import { MuiOtpInput } from "mui-one-time-password-input";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { resendVerifcationCode, type resendVerifcationCodeRequest } from "../../../api/AuthApi";
import { CustomFormHeader } from "../components/CustomInputs";

type otpProps = {
  email: string;
  isContinueDisabled: boolean;
  handleBack: () => void;
  handleNext: () => void;
  isPending: boolean;
};

export function Otp({ email, isContinueDisabled, handleBack, handleNext, isPending }: otpProps) {
  const theme = useTheme();
  const { control } = useFormContext();

  const queryClient = useQueryClient();
  let otpExpiresAt = parseISO(queryClient.getQueryData(["otpExpiresAt"]) ?? "").getTime();
  const [endTime, setEndTime] = useState(otpExpiresAt);

  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const resendVerifcationMutation = useMutation({
    mutationFn: (data: resendVerifcationCodeRequest) => resendVerifcationCode(data),
    onSuccess: (response: AxiosResponse) => {
      otpExpiresAt = parseISO(response.data).getTime();
      setEndTime(otpExpiresAt);
      setIsResendDisabled(true);
    },
  });

  const handleResend = async () => {
    await resendVerifcationMutation.mutateAsync({ identifier: email });
  };

  return (
    <Stack gap={3} padding={2}>
      <CustomFormHeader
        header="Verify email"
        subtext={
          <>
            Enter the <b>6 digit code</b> sent to
            <br /> <b>{email?.toLowerCase()}.</b>
          </>
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
              <Typography fontSize={13.5} color={theme.palette.text.secondary} textAlign="center">
                Code expires in{" "}
                <b>
                  {zeroPad(minutes)}:{zeroPad(seconds)}
                </b>
              </Typography>
            );
          } else {
            return (
              <Typography fontSize={15} color={theme.palette.error.main} textAlign="center">
                Code expired
              </Typography>
            );
          }
        }}
      />

      {!isResendDisabled && (
        <Typography fontSize={15} color={theme.palette.text.secondary} alignSelf="center">
          Didn't get the Code?{" "}
          <Button
            type="button"
            variant="text"
            size="small"
            disableRipple
            disableTouchRipple
            disableFocusRipple
            disabled={resendVerifcationMutation.isPending}
            onClick={handleResend}
            sx={{
              padding: "0",
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
        type="button"
        size="large"
        variant="contained"
        onClick={handleNext}
        loading={isPending}
        disabled={isContinueDisabled}
      >
        Continue
      </Button>

      <Button variant="outlined" type="button" size="large" onClick={handleBack}>
        Back
      </Button>
    </Stack>
  );
}

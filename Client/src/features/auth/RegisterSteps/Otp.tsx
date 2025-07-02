import { useState } from "react";
import { type FieldError } from "react-hook-form";
import Countdown, { zeroPad } from "react-countdown";

import { useTheme } from "@mui/material/styles";
import { MuiOtpInput } from "mui-one-time-password-input";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type otpProps = {
  email: string;
  value: string;
  onChange: (value: string) => void;
  error: FieldError | undefined;
  serverError: string | null;
  handleBack: () => void;
  handleNext: () => void;
  isPending: boolean;
};

export function Otp({
  email,
  value,
  onChange,
  error,
  serverError,
  handleBack,
  handleNext,
  isPending,
}: otpProps) {
  const theme = useTheme();
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const timerLength = 300000;
  const [endTime, setEndTime] = useState(Date.now() + timerLength);

  const onResendCick = () => {
    setEndTime(Date.now() + timerLength);
    setIsResendDisabled(true);
  };

  return (
    <Stack gap={3} padding={2}>
      <Stack>
        <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
          Verify email
        </Typography>
        <Typography
          fontWeight={200}
          fontSize={13.5}
          color={theme.palette.text.secondary}
          sx={{ textWrap: "nowrap" }}
        >
          Enter the <b>6 digit code</b> sent to the email address below
          <br /> <b>{email ? email.toLowerCase() : "someone@example.com"}</b>
        </Typography>
      </Stack>

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
      {error?.message && (
        <FormHelperText error sx={{ margin: "-1rem 0 0 0" }}>
          {error.message}
        </FormHelperText>
      )}

      <Countdown
        key={endTime}
        date={endTime}
        onStart={() => {
          setTimeout(() => {
            setIsResendDisabled(false);
          }, timerLength / 2);
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
            disableRipple
            disableTouchRipple
            disableFocusRipple
            disabled={isResendDisabled}
            onClick={onResendCick}
            sx={{
              padding: "0",
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
        disabled={serverError !== null}
      >
        {serverError !== null ? serverError : "Continue"}
      </Button>

      <Button variant="outlined" type="button" size="large" onClick={handleBack}>
        Back
      </Button>
    </Stack>
  );
}

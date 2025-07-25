import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import {
  type startLoginRequest,
  startLogin,
  type startLoginResponse,
  type completeLoginRequest,
  completeLogin,
} from "@/api/AuthApi";
import { OtpPage } from "@/features/auth/components/OtpPage";
import { formThemeDesktop } from "@/features/auth/FormThemeDesktop";
import { UsernameAndPassword } from "@/features/auth/LoginSteps/UsernameAndPassword";
import { LogoWithName } from "@/shared/components/Logo";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";
import { useServerError, type ServerError } from "@/shared/hooks/useServerError";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

const LoginFormSchema = z.object({
  identifier: z.string("Invalid username or email").nonempty("Please enter username or email"),
  password: z.string("Invalid password").nonempty("Please enter password"),
  otp: z.string("Invalid otp").trim().length(6, "Invalid otp"),
});

type loginFormSchema = z.infer<typeof LoginFormSchema>;

function Login() {
  const [step, setStep] = useState<number>(0);
  const [otpData, setOtpData] = useState<{
    email: string;
    otpExpiresAt: string;
  } | null>(null);

  const { serverError, continueDisabled, handleServerError, clearServerError } = useServerError();
  const defaultTheme = useTheme();
  const { isSmOrLarger } = useBreakpoint();
  const navigate = useNavigate();

  const methods = useForm<loginFormSchema>({
    mode: "onChange",
    resolver: zodResolver(LoginFormSchema),
  });

  const startLoginMutation = useMutation({
    mutationFn: (data: startLoginRequest) => startLogin(data),
    onSuccess: (response: AxiosResponse<startLoginResponse>) => {
      const data = response.data;
      setOtpData({
        email: data.email,
        otpExpiresAt: data.otpExpiresAt,
      });
      setStep(1);
    },
    onError: (error: ServerError) => handleServerError(error),
  });

  const completeLoginMutation = useMutation({
    mutationFn: (data: completeLoginRequest) => completeLogin(data),
    onSuccess: () => navigate({ to: "/home" }),
    onError: (error: ServerError) => handleServerError(error),
  });

  const handleNext = async () => {
    const isValid = await methods.trigger(["identifier", "password"]);

    if (isValid) {
      clearServerError();
      const identifier = methods.getValues("identifier");
      const password = methods.getValues("password");
      startLoginMutation.mutate({ identifier, password });
    }
  };

  const handleOtpExpiresAtUpdate = (newExpiresAt: string) => {
    if (otpData) {
      setOtpData({
        ...otpData,
        otpExpiresAt: newExpiresAt,
      });
    }
  };

  const onSubmit = async (formData: loginFormSchema) => {
    completeLoginMutation.mutate(formData);
  };

  const theme = isSmOrLarger ? formThemeDesktop : defaultTheme;
  const form = (
    <Stack
      paddingBlock={2}
      paddingInline={1}
      gap={2}
      onSubmit={methods.handleSubmit(onSubmit)}
      sx={{
        maxWidth: { xs: "100%", sm: "480px" },
        height: "fit-content",
        backgroundColor: theme.palette.background.default,
        boxShadow: { sm: "0 0 2px rgba(225, 225, 225, .5)" },
        borderRadius: { sm: "1rem" },
      }}
    >
      {!isSmOrLarger && <LogoWithName size="large" align="center" />}

      {serverError !== null && (
        <Alert severity="error" sx={{ color: theme.palette.text.primary, fontSize: "1rem" }}>
          {serverError}
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 0 && (
            <UsernameAndPassword
              handleNext={handleNext}
              isPending={startLoginMutation.isPending}
              isContinueDisabled={continueDisabled}
            />
          )}
          {step === 1 && otpData && (
            <OtpPage
              email={otpData.email}
              otpExpiresAt={otpData.otpExpiresAt}
              handleBack={() => setStep(0)}
              isPending={completeLoginMutation.isPending}
              isContinueDisabled={continueDisabled}
              onOtpExpiresAtUpdate={handleOtpExpiresAtUpdate}
              mode="login"
            />
          )}
        </form>
      </FormProvider>
    </Stack>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        alignItems: { sm: "center" },
        justifyContent: "center",
        background: {
          sm: "radial-gradient(ellipse 150% 100% at top left, #42a5f5 0%, rgba(21, 101, 192, 0.7) 40%, rgba(13, 71, 161, 0.3) 70%, transparent 100%), radial-gradient(ellipse 120% 80% at bottom right, #1565c0 0%, rgba(13, 71, 161, 0.5) 50%, transparent 80%), radial-gradient(circle at center, #181818 0%, #2c2c2c 100%)",
        },
        position: "relative",
      }}
    >
      {isSmOrLarger && (
        <Box sx={{ position: "absolute", top: "2rem", left: "3rem" }}>
          <LogoWithName size="large" color="white" />
        </Box>
      )}

      {isSmOrLarger ? <ThemeProvider theme={formThemeDesktop}>{form}</ThemeProvider> : form}
    </Box>
  );
}

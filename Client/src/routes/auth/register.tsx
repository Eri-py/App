import { useForm, FormProvider } from "react-hook-form";
import { string, z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type AxiosError } from "axios";

import { ThemeProvider } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  usernameSchema,
  emailSchema,
  passwordSchema,
  dateSchema,
} from "../../features/auth/Schemas";
import { UsernameAndEmail } from "../../features/auth/RegisterSteps/UsernameAndEmail";
import { HorizontalLinearStepper } from "../../features/auth/components/HorizontalLinearStepper";
import { verifyOtp, startRegistration, completeRegistration } from "../../api/Auth";
import { formThemeDesktop } from "../../themes/FormThemeDesktop";
import { Otp } from "../../features/auth/RegisterSteps/Otp";
import { Password } from "../../features/auth/RegisterSteps/Password";
import { PersonalDetails } from "../../features/auth/RegisterSteps/PersonalDetails";
import type {
  completeRegistrationRequest,
  startRegistrationRequest,
  verifyOtpRequest,
} from "../../api/Dtos";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

const ResgisterSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  otp: z.string().length(6, "Invalid code"),
  password: passwordSchema,
  confirmPassword: string().min(3, "Please enter password again"),
  firstname: string().min(3, "Firstname is required").max(64),
  lastname: string().min(3, "Lastname is required").max(64),
  dateOfBirth: dateSchema,
});

export type registerSchema = z.infer<typeof ResgisterSchema>;

const registrationSteps: Record<number, (keyof registerSchema)[]> = {
  0: ["username", "email"],
  1: ["otp"],
  2: ["password", "confirmPassword"],
  3: ["firstname", "lastname", "dateOfBirth"],
};

const registrationStepsLabels: string[] = [
  "Username and Email",
  "Verifiction Code",
  "Password",
  "Personal Details",
];

export function Register() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<number>(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const defaultTheme = useTheme();
  const isSmOrLarger = useMediaQuery(defaultTheme.breakpoints.up("sm"));

  const methods = useForm<registerSchema>({
    mode: "all",
    resolver: zodResolver(ResgisterSchema),
  });

  const handleServerError = (error: AxiosError) => {
    const errorMessage = error.request.response || error.message;
    setServerError(errorMessage);

    setTimeout(() => {
      setServerError(null);
    }, 2000);
  };

  const startRegistrationMutation = useMutation({
    mutationFn: (data: startRegistrationRequest) => startRegistration(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["otpExpiresAt"], response.data);
      setStep(1);
    },
    onError: (error: AxiosError) => handleServerError(error),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: verifyOtpRequest) => verifyOtp(data),
    onSuccess: () => setStep(2),
    onError: (error: AxiosError) => handleServerError(error),
  });

  const completeRegistrationMutation = useMutation({
    mutationFn: (data: completeRegistrationRequest) => completeRegistration(data),
    onSuccess: (data) => console.log(data),
    onError: (error: AxiosError) => handleServerError(error),
  });

  const handleNext = async () => {
    const currentStep = registrationSteps[step];
    const isValid = await methods.trigger(currentStep);

    if (isValid) {
      switch (step) {
        case 0: {
          const username = methods.getValues("username");
          const email = methods.getValues("email");
          await startRegistrationMutation.mutateAsync({ username, email });
          break;
        }
        case 1: {
          const username = methods.getValues("username");
          const email = methods.getValues("email");
          const otp = methods.getValues("otp");
          await verifyOtpMutation.mutateAsync({ username, email, otp });
          break;
        }
        case 2: {
          const password = methods.getValues("password");
          const confirmPassword = methods.getValues("confirmPassword");
          if (password !== confirmPassword) {
            methods.setError("confirmPassword", { message: "Passwords do not match" });
            break;
          }
          setStep(3);
          break;
        }
      }
    }
  };

  const onSubmit = async (formData: registerSchema) => {
    console.log(formData);
    // await completeRegistrationMutation.mutateAsync(formData);
  };

  const theme = isSmOrLarger ? formThemeDesktop : defaultTheme;
  const form = (
    <Stack
      padding={2}
      gap={2}
      sx={{
        maxWidth: { xs: "100%", sm: "480px" },
        height: "fit-content",
        backgroundColor: theme.palette.background.default,
        boxShadow: { sm: "0 0 5px rgba(225, 225, 225, .5)" },
        borderRadius: { sm: "1rem" },
      }}
    >
      <HorizontalLinearStepper
        steps={registrationStepsLabels}
        activeStep={step}
        setActiveStep={(value) => setStep(value)}
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 0 && (
            <UsernameAndEmail
              handleNext={handleNext}
              isPending={startRegistrationMutation.isPending}
              serverError={serverError}
            />
          )}
          {step === 1 && (
            <Otp
              email={methods.getValues("email")}
              handleNext={handleNext}
              handleBack={() => setStep(0)}
              isPending={verifyOtpMutation.isPending}
              serverError={serverError}
            />
          )}
          {step === 2 && <Password handleNext={handleNext} />}
          {step === 3 && (
            <PersonalDetails
              isPending={completeRegistrationMutation.isPending}
              serverError={serverError}
            />
          )}
        </form>
      </FormProvider>
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: { sm: "center" },
        justifyContent: "center",
        background: {
          sm: "radial-gradient(ellipse 150% 100% at top left, #42a5f5 0%, rgba(21, 101, 192, 0.7) 40%, rgba(13, 71, 161, 0.3) 70%, transparent 100%), radial-gradient(ellipse 120% 80% at bottom right, #1565c0 0%, rgba(13, 71, 161, 0.5) 50%, transparent 80%), radial-gradient(circle at center, #181818 0%, #2c2c2c 100%)",
        },
      }}
    >
      {isSmOrLarger ? <ThemeProvider theme={formThemeDesktop}>{form}</ThemeProvider> : form}
    </Box>
  );
}

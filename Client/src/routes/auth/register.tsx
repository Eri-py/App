import { useForm, FormProvider } from "react-hook-form";
import { string, z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ThemeProvider } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";

import {
  usernameSchema,
  emailSchema,
  passwordSchema,
  nameSchema,
  dateOfBirthSchema,
} from "../../features/auth/Schemas";
import { UsernameAndEmail } from "../../features/auth/RegisterSteps/UsernameAndEmail";
import { HorizontalLinearStepper } from "../../components/HorizontalLinearStepper";
import { OtpPage } from "../../features/auth/components/OtpPage";
import { Password } from "../../features/auth/RegisterSteps/Password";
import { PersonalDetails } from "../../features/auth/RegisterSteps/PersonalDetails";
import { formThemeDesktop } from "../../themes/FormThemeDesktop";
import {
  verifyOtpRegistration,
  startRegistration,
  completeRegistration,
  type completeRegistrationRequest,
  type startRegistrationRequest,
  type verifyOtpRegistrationRequest,
} from "../../api/AuthApi";
import { useServerError, type ServerError } from "../../api/Client";
import { LogoWithName } from "../../components/Logo";
import type { AxiosResponse } from "axios";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

const RegistrationFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  otp: z.string("Invalid otp").trim().length(6, "Invalid otp"),
  password: passwordSchema,
  confirmPassword: string("Invalid password").nonempty("Please enter password again"),
  firstname: nameSchema("Firstname"),
  lastname: nameSchema("Lastname"),
  dateOfBirth: dateOfBirthSchema,
});

export type registrationFormSchema = z.infer<typeof RegistrationFormSchema>;

const registrationSteps: Record<number, (keyof registrationFormSchema)[]> = {
  0: ["username", "email"],
  1: ["otp"],
  2: ["password", "confirmPassword"],
  3: ["firstname", "lastname", "dateOfBirth"],
};

const registrationStepLabels: string[] = [
  "Username and Email",
  "Verifiction Code",
  "Password",
  "Personal Details",
];

function Register() {
  const [step, setStep] = useState<number>(0);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);

  const { serverError, continueDisabled, handleServerError, clearServerError } = useServerError();
  const defaultTheme = useTheme();
  const isSmOrLarger = useMediaQuery(defaultTheme.breakpoints.up("sm"));
  const navigate = useNavigate();

  const methods = useForm<registrationFormSchema>({
    mode: "onChange",
    resolver: zodResolver(RegistrationFormSchema),
  });

  const startRegistrationMutation = useMutation({
    mutationFn: (data: startRegistrationRequest) => startRegistration(data),
    onSuccess: (response: AxiosResponse<string>) => {
      setOtpExpiresAt(response.data);
      setStep(1);
    },
    onError: (error: ServerError) => handleServerError(error),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: verifyOtpRegistrationRequest) => verifyOtpRegistration(data),
    onSuccess: () => setStep(2),
    onError: (error: ServerError) => handleServerError(error),
  });

  const completeRegistrationMutation = useMutation({
    mutationFn: (data: completeRegistrationRequest) => completeRegistration(data),
    onSuccess: () => navigate({ to: "/home" }),
    onError: (error: ServerError) => handleServerError(error),
  });

  const handleNext = async () => {
    const currentStep = registrationSteps[step];
    const isValid = await methods.trigger(currentStep);

    if (isValid) {
      clearServerError();
      switch (step) {
        case 0: {
          const username = methods.getValues("username");
          const email = methods.getValues("email");
          await startRegistrationMutation.mutateAsync({ username, email });
          break;
        }
        case 1: {
          const email = methods.getValues("email");
          const otp = methods.getValues("otp");
          await verifyOtpMutation.mutateAsync({ email, otp });
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

  const handleOtpExpiresAtUpdate = (newExpiresAt: string) => {
    setOtpExpiresAt(newExpiresAt);
  };

  const onSubmit = async (formData: registrationFormSchema) => {
    clearServerError();
    await completeRegistrationMutation.mutateAsync(formData);
  };

  const theme = isSmOrLarger ? formThemeDesktop : defaultTheme;
  const form = (
    <Stack
      padding={1}
      gap={2}
      sx={{
        width: { xs: "100%", sm: "480px" },
        height: "fit-content",
        backgroundColor: theme.palette.background.default,
        boxShadow: { sm: "0 0 2px rgba(225, 225, 225, .5)" },
        borderRadius: { sm: "1rem" },
      }}
    >
      {!isSmOrLarger && <LogoWithName size="large" align="center" />}

      <HorizontalLinearStepper
        steps={registrationStepLabels}
        activeStep={step}
        setActiveStep={(value) => setStep(value)}
      />

      {serverError !== null && (
        <Alert severity="error" sx={{ color: theme.palette.text.primary, fontSize: "1rem" }}>
          {serverError}
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 0 && (
            <UsernameAndEmail
              handleNext={handleNext}
              isPending={startRegistrationMutation.isPending}
              isContinueDisabled={continueDisabled}
            />
          )}
          {step === 1 && otpExpiresAt && (
            <OtpPage
              email={methods.getValues("email")}
              otpExpiresAt={otpExpiresAt}
              handleNext={handleNext}
              handleBack={() => setStep(0)}
              isPending={verifyOtpMutation.isPending}
              isContinueDisabled={continueDisabled}
              onOtpExpiresAtUpdate={handleOtpExpiresAtUpdate}
              mode="register"
            />
          )}
          {step === 2 && <Password handleNext={handleNext} />}
          {step === 3 && (
            <PersonalDetails
              isPending={completeRegistrationMutation.isPending}
              isContinueDisabled={continueDisabled}
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

import { useForm, FormProvider, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type AxiosError } from "axios";

import { ThemeProvider } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  usernameSchema,
  emailSchema,
  otpSchema,
  passwordSchema,
  genericTextSchema,
  dateOfBirthSchema,
} from "../../features/auth/Schemas";
import { UsernameAndEmail } from "../../features/auth/RegisterSteps/UsernameAndEmail";
import HorizontalLinearStepper from "../../features/auth/components/HorizontalLinearStepper";
import { verifyOtp, startRegisteration } from "../../api/auth";
import { formThemeDesktop } from "../../themes/FormThemeDesktop";
import { Otp } from "../../features/auth/RegisterSteps/Otp";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

const ResgisterSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  otp: otpSchema,
  password: passwordSchema,
  confirmPassword: genericTextSchema("Password again"),
  name: genericTextSchema("Name"),
  dateOfBirth: dateOfBirthSchema,
});

type registerSchema = z.infer<typeof ResgisterSchema>;

const registrationSteps: Record<number, (keyof registerSchema)[]> = {
  0: ["username", "email"],
  1: ["otp"],
  2: ["password", "confirmPassword"],
  3: ["name", "dateOfBirth"],
};

const registrationStepsLabels: string[] = [
  "Username and Email",
  "Verifiction Code",
  "Step three",
  "Step four",
];

export function Register() {
  const [step, setStep] = useState<number>(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const defaultTheme = useTheme();
  const isSmOrLarger = useMediaQuery(defaultTheme.breakpoints.up("sm"));

  const methods = useForm<registerSchema>({
    mode: "all",
    resolver: zodResolver(ResgisterSchema),
  });

  const handleServerError = (error: string) => {
    setServerError(error);
    setTimeout(() => {
      setServerError(null);
    }, 2000);
  };

  const verifyCredentialsMutation = useMutation({
    mutationFn: ({ username, email }: { username: string; email: string }) =>
      startRegisteration(username, email),

    onSuccess: () => {
      setStep(1);
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.request.response || error.message;
      handleServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ username, email, otp }: { username: string; email: string; otp: string }) =>
      verifyOtp(username, email, otp),

    onSuccess: () => {
      setStep(2);
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.request.response || error.message;
      handleServerError(errorMessage);
    },
  });

  const handleNext = async () => {
    const currentStep = registrationSteps[step];
    const isValid = await methods.trigger(currentStep);

    if (isValid) {
      const values = methods.getValues(currentStep);

      switch (step) {
        case 0: {
          const [username, email] = values;
          await verifyCredentialsMutation.mutateAsync({ username, email });
          break;
        }
        case 1: {
          const [username, email] = methods.getValues(["username", "email"]);
          const [otp] = values;
          await verifyOtpMutation.mutateAsync({ username, email, otp });
          break;
        }
      }
    }
  };

  const handleBack = () => {
    switch (step) {
      case 1:
      case 2:
        setStep(0);
        break;
      case 3:
        setStep(2);
    }
  };

  const onSubmit = (data: registerSchema) => {
    console.log(data);
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
      {/*Render Back button if it's a mobile screen*/}
      {step !== 0 && !isSmOrLarger && (
        <Button
          variant="text"
          type="button"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ alignSelf: "start" }}
        />
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 0 && (
            <UsernameAndEmail
              handleNext={handleNext}
              isPending={verifyCredentialsMutation.isPending}
              serverError={serverError}
            />
          )}
          {step === 1 && (
            <Controller
              control={methods.control}
              name="otp"
              render={({ field, formState: { errors } }) => (
                <Otp
                  {...field}
                  email={methods.getValues("email")}
                  error={errors.otp}
                  serverError={serverError}
                  handleNext={handleNext}
                  handleBack={handleBack}
                  isPending={verifyOtpMutation.isPending}
                />
              )}
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

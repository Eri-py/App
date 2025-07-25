import { Link } from "@tanstack/react-router";

import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

type AuthFooterProps = {
  mode: "login" | "register";
};

export function AuthFooter({ mode }: AuthFooterProps) {
  const theme = useTheme();

  const footerContent = {
    login: {
      question: "Don't have an account?",
      linkText: "sign up here",
      target: "/auth/register",
    },
    register: {
      question: "Already have an account?",
      linkText: "login here",
      target: "/auth/login",
    },
  };

  const currentContent = footerContent[mode];

  return (
    <Stack gap="0.25rem">
      <Typography
        alignSelf="center"
        sx={{
          color: theme.palette.text.primary,
          fontSize: "0.875rem",
        }}
      >
        {currentContent.question}{" "}
        <CustomLink to={currentContent.target}>{currentContent.linkText}</CustomLink>
      </Typography>
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "0.75rem",
          lineHeight: 1.4,
        }}
      >
        This site is protected by reCAPTCHA and the Google{" "}
        <CustomLink to="#">Privacy Policy</CustomLink> and{" "}
        <CustomLink to="#">Terms of Service</CustomLink> apply
      </Typography>
    </Stack>
  );
}

import { Link } from "@tanstack/react-router";

import { styled, useTheme } from "@mui/material/styles";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CustomTextField } from "../components/CustomTextField";
import { OAuthButtonGroup } from "../components/OAuthButtonGroup";

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

type usernameAndEmailProps = {
  handleNext: () => void;
  isPending: boolean;
  serverError: string | null;
};

export function UsernameAndEmail({ handleNext, isPending, serverError }: usernameAndEmailProps) {
  const theme = useTheme();

  return (
    <Stack gap={3} paddingInline={1.5}>
      <Stack>
        <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
          Sign up
        </Typography>
        <Typography fontWeight={200} fontSize={15} color={theme.palette.text.secondary}>
          join thousands of users already on our platform.
        </Typography>
      </Stack>

      <CustomTextField
        type="text"
        label="Username"
        fieldValue="username"
        startIcon={<AccountCircleOutlinedIcon />}
        autoComplete="off"
      />

      <CustomTextField
        type="email"
        label="Email"
        fieldValue="email"
        startIcon={<EmailOutlinedIcon />}
        autoComplete="email"
      />

      <Button
        variant="contained"
        size="large"
        type="button"
        onClick={handleNext}
        loading={isPending}
        disabled={serverError !== null}
      >
        {serverError ?? "Continue"}
      </Button>

      <OAuthButtonGroup />

      <Stack gap={2}>
        <Typography
          alignSelf="center"
          sx={{
            color: theme.palette.text.primary,
            fontSize: "0.875rem",
          }}
        >
          Already have an account? <CustomLink to="/auth/sign-in">Log in here</CustomLink>
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
    </Stack>
  );
}

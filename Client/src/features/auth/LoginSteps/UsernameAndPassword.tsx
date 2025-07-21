import { Link } from "@tanstack/react-router";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { styled, useTheme } from "@mui/material/styles";

import { OAuthButtonGroup } from "../components/OAuthButtonGroup";
import { CustomTextField } from "../components/CustomInputs";

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

type UsernameAndPasswordProps = {
  handleNext: () => void;
  isPending: boolean;
  isContinueDisabled: boolean;
};

export function UsernameAndPassword({
  handleNext,
  isPending,
  isContinueDisabled,
}: UsernameAndPasswordProps) {
  const theme = useTheme();
  return (
    <Stack gap={2} paddingInline={1.5}>
      <Stack alignItems="center">
        <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
          Login in
        </Typography>
        <Typography fontWeight={200} fontSize={15} color={theme.palette.text.secondary}>
          Glad to have you back!
        </Typography>
      </Stack>

      <CustomTextField
        type="text"
        label="Username or Email"
        fieldValue="identifier"
        startIcon={<AccountCircleOutlinedIcon />}
        autoComplete="email"
      />

      <CustomTextField
        type="password"
        label="Password"
        fieldValue="password"
        startIcon={<EmailOutlinedIcon />}
        autoComplete="off"
      />

      <Button
        variant="contained"
        size="large"
        type="button"
        onClick={handleNext}
        loading={isPending}
        disabled={isContinueDisabled}
      >
        Continue
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
          Don't have an account? <CustomLink to="/auth/register">Sign up here</CustomLink>
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

import { useTheme } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";

import { CustomTextField } from "../components/CustomTextField";

type PasswordProps = {
  handleNext: () => void;
  isPending: boolean;
  serverError: string | null;
};

export function Password({ handleNext, isPending, serverError }: PasswordProps) {
  const theme = useTheme();

  return (
    <Stack gap={3} paddingInline={1.5}>
      <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
        Create a strong password
      </Typography>

      <CustomTextField
        type="password"
        label="Password"
        fieldValue="password"
        startIcon={<LockIcon />}
      />

      <Stack gap={0.5} marginLeft={1.5} marginTop={-2}>
        <Typography fontWeight={200} fontSize={13} color={theme.palette.text.secondary}>
          • 8-64 characters
        </Typography>
        <Typography fontWeight={200} fontSize={13} color={theme.palette.text.secondary}>
          • One uppercase letter (A-Z)
        </Typography>
        <Typography fontWeight={200} fontSize={13} color={theme.palette.text.secondary}>
          • One lowercase letter (a-z)
        </Typography>
        <Typography fontWeight={200} fontSize={13} color={theme.palette.text.secondary}>
          • One number (0-9)
        </Typography>
        <Typography fontWeight={200} fontSize={13} color={theme.palette.text.secondary}>
          • One special character (# ? ! @ $ % ^ & - .)
        </Typography>
        <Typography fontWeight={200} fontSize={13} color={theme.palette.text.secondary}>
          • Only allowed characters above
        </Typography>
      </Stack>

      <CustomTextField
        type="password"
        label="Confirm Password"
        fieldValue="confirmPassword"
        startIcon={<LockIcon />}
      />

      <Button
        type="button"
        variant="contained"
        size="large"
        onClick={handleNext}
        loading={isPending}
        disabled={serverError !== null}
      >
        {serverError !== null ? serverError : "Continue"}
      </Button>
    </Stack>
  );
}

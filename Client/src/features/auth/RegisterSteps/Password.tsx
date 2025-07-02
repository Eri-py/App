import { PasswordField } from "../components/PasswordField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

type PasswordProps = {
  handleNext: () => void;
  handleBack: () => void;
  isPending: boolean;
  serverError: string | null;
};

export function Password({ handleNext, handleBack, isPending, serverError }: PasswordProps) {
  const theme = useTheme();
  return (
    <Stack gap={3} paddingInline={1.5}>
      <Stack>
        <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
          Password
        </Typography>
        <Typography fontWeight={200} fontSize={15} color={theme.palette.text.secondary}>
          join thousands of users already on our platform
        </Typography>
      </Stack>

      <PasswordField label="Password" fieldValue="password" />
      <PasswordField label="Confirm Password" fieldValue="confirmPassword" />

      <Button
        variant="contained"
        size="large"
        type="button"
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

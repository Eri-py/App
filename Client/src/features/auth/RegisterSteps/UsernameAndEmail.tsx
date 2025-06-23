import { useFormContext } from "react-hook-form";
import { Link } from "@tanstack/react-router";

import TextField from "@mui/material/TextField";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Button from "@mui/material/Button";
import AppleIcon from "@mui/icons-material/Apple";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FacebookIcon, GoogleIcon } from "../../../components/CustomIcons";

const CircularButton = styled(Button)(({ theme }) => ({
  minWidth: "48px",
  padding: "0.6rem",
  aspectRatio: "1",
  borderRadius: "50%",
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.text.primary,
  "&:hover": {
    borderColor: theme.palette.primary.light,
  },
}));

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

type stepOneProps = {
  handleNext: () => void;
  isPending: boolean;
  serverError: string | null;
};

export function UsernameAndEmail({ handleNext, isPending, serverError }: stepOneProps) {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack gap={3} paddingInline={1.5}>
      <Stack>
        <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
          Sign up
        </Typography>
        <Typography fontWeight={200} fontSize={15} color={theme.palette.text.secondary}>
          join thousands of users already on our platform
        </Typography>
      </Stack>

      <TextField
        variant="outlined"
        type="text"
        label="Username"
        error={!!errors.username}
        helperText={errors.username?.message as string}
        slotProps={{
          input: {
            startAdornment: <PersonOutlinedIcon sx={{ color: theme.palette.text.secondary }} />,
            sx: {
              gap: "0.75rem",
              backgroundColor: theme.palette.background.paper,
            },
          },
          htmlInput: {
            ...register("username"),
          },
        }}
      />
      <TextField
        variant="outlined"
        type="email"
        label="Email"
        placeholder="e.g Example@gmail.com"
        error={!!errors.email}
        helperText={errors.email?.message as string}
        slotProps={{
          input: {
            startAdornment: <EmailOutlinedIcon sx={{ color: theme.palette.text.primary }} />,
            sx: {
              gap: "0.75rem",
              backgroundColor: theme.palette.background.paper,
            },
          },
          htmlInput: { ...register("email") },
        }}
      />
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

      <Box sx={{ display: "flex", alignItems: "center", my: -1.5 }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography
          variant="body2"
          sx={{
            mx: 2,
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
          }}
        >
          or
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      <Stack direction="row" spacing={2} alignSelf="center">
        <CircularButton type="button" variant="outlined">
          <GoogleIcon width="32px" />
        </CircularButton>
        <CircularButton type="button" variant="outlined">
          <AppleIcon
            fontSize="large"
            sx={{
              color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            }}
          />
        </CircularButton>
        <CircularButton type="button" variant="outlined">
          <FacebookIcon width="32" />
        </CircularButton>
      </Stack>

      <Stack gap={2}>
        <Divider sx={{ borderColor: theme.palette.divider }} />
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

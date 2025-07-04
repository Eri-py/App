import { Link } from "@tanstack/react-router";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Button from "@mui/material/Button";
import AppleIcon from "@mui/icons-material/Apple";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FacebookIcon, GoogleIcon } from "../../../components/CustomIcons";
import { CustomTextField } from "../components/CustomTextField";

const CircularButton = styled(Button)(({ theme }) => ({
  minWidth: "48px",
  padding: "0.6rem",
  aspectRatio: "1",
  borderRadius: "50%",
  border: `1px solid ${theme.palette.primary.main}`,
  "&:hover": {
    borderColor: theme.palette.primary.light,
  },
}));

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
          join thousands of users already on our platform
        </Typography>
      </Stack>

      <CustomTextField
        type="text"
        label="Username"
        fieldValue="username"
        startIcon={<AccountCircleOutlinedIcon />}
      />

      <CustomTextField
        type="email"
        label="Email"
        fieldValue="email"
        startIcon={<EmailOutlinedIcon />}
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

      {/*OAuth Button group*/}
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
          <FacebookIcon width="32px" />
        </CircularButton>
      </Stack>

      {/*Footer*/}
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

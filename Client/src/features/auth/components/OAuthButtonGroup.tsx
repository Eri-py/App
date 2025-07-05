import { styled, useTheme } from "@mui/material/styles";
import AppleIcon from "@mui/icons-material/Apple";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { FacebookIcon, GoogleIcon } from "../../../components/CustomIcons";

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

export function OAuthButtonGroup() {
  const theme = useTheme();

  return (
    <Stack gap={2}>
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
          <FacebookIcon width="32px" />
        </CircularButton>
      </Stack>

      <Divider sx={{ borderColor: theme.palette.divider }} />
    </Stack>
  );
}

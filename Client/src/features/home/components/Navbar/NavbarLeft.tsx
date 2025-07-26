import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";

import { LogoWithName } from "@/shared/components/Logo";

type NavbarLeftSectionProps = {
  onMenuClick: () => void;
};

export function NavbarLeft({ onMenuClick }: NavbarLeftSectionProps) {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="large" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Button
        variant="text"
        sx={{
          "&:hover": {
            background: "none",
          },
        }}
      >
        <LogoWithName size="medium" />
      </Button>
    </Stack>
  );
}

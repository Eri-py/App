import { useTheme } from "@mui/material/styles";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

import TextField from "@mui/material/TextField";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

type PasswordFieldProps = {
  label: string;
  fieldValue: string;
};

export function PasswordField({ label, fieldValue }: PasswordFieldProps) {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const getEndAdornment = () => {
    return (
      <Button
        type="button"
        variant="text"
        disableRipple
        disableTouchRipple
        disableFocusRipple
        onClick={() => {
          setPasswordVisible(!isPasswordVisible);
        }}
        sx={{
          padding: "0",
          color: "black",
          "&:hover": {
            background: "none",
          },
        }}
      >
        {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </Button>
    );
  };

  return (
    <TextField
      variant="outlined"
      type={isPasswordVisible ? "text" : "password"}
      label={label}
      error={!!errors[fieldValue]}
      helperText={errors[fieldValue]?.message as string}
      slotProps={{
        input: {
          startAdornment: <LockIcon />,
          endAdornment: getEndAdornment(),
          sx: {
            gap: "0.75rem",
            backgroundColor: theme.palette.background.paper,
          },
        },
        htmlInput: {
          ...register(fieldValue),
        },
      }}
    />
  );
}

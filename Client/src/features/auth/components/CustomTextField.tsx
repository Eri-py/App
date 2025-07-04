import { useTheme } from "@mui/material/styles";
import { useFormContext, get } from "react-hook-form";
import { useState } from "react";
import type { ReactNode } from "@tanstack/react-router";
import { type FieldPath } from "react-hook-form";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { registerSchema } from "../../../routes/auth/register";

type validSchema = registerSchema;

type CustomTextFieldProps = {
  type: string;
  label: string;
  fieldValue: FieldPath<validSchema>;
  startIcon?: ReactNode;
  flex?: number;
};

export function CustomTextField({
  type,
  label,
  fieldValue,
  startIcon,
  flex = 1,
}: CustomTextFieldProps) {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isPasswordField = type === "password";
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
          color: theme.palette.text.primary,
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
      type={isPasswordField ? (isPasswordVisible ? "text" : "password") : type}
      label={label}
      error={!!get(errors, fieldValue)}
      helperText={get(errors, fieldValue)?.message as string}
      sx={{ flex: flex }}
      slotProps={{
        input: {
          startAdornment: startIcon ?? "",
          endAdornment: isPasswordField && getEndAdornment(),
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

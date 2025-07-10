import { Controller, get, useFormContext } from "react-hook-form";

import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { CustomTextField } from "../components/CustomTextField";
import { SegmentedDatePicker } from "../components/SegmentedDatePicker";

type PersonalDetailsProps = {
  isPending: boolean;
  isContinueDisabled: boolean;
};

export function PersonalDetails({ isPending, isContinueDisabled }: PersonalDetailsProps) {
  const theme = useTheme();
  const { control } = useFormContext();

  return (
    <Stack gap={3} paddingInline={1.5}>
      <Stack>
        <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
          Personal details
        </Typography>
        <Typography fontWeight={200} fontSize={15} color={theme.palette.text.secondary}>
          {"Let's get to know a bit more about you :)"}
        </Typography>
      </Stack>

      <CustomTextField
        type="text"
        label="Firstname"
        fieldValue="firstname"
        startIcon={<PersonOutlineIcon />}
        autoComplete="given-name"
      />

      <CustomTextField
        type="text"
        label="Lastname"
        fieldValue="lastname"
        startIcon={<PersonOutlineIcon />}
        autoComplete="family-name"
      />

      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field: { value, onChange }, formState: { errors } }) => (
          <SegmentedDatePicker
            value={value}
            onChange={onChange}
            error={get(errors, "dateOfBirth")?.message}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isPending}
        disabled={isContinueDisabled}
      >
        Submit
      </Button>
    </Stack>
  );
}

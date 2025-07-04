import { Controller, useFormContext, get } from "react-hook-form";

import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FormHelperText from "@mui/material/FormHelperText";

import { CustomTextField } from "../components/CustomTextField";
import { Selector } from "../components/Selector";

type PersonalDetailsProps = {
  isPending: boolean;
  serverError: string | null;
};

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function PersonalDetails({ isPending, serverError }: PersonalDetailsProps) {
  const theme = useTheme();
  const { control } = useFormContext();

  return (
    <Stack gap={3} paddingInline={1.5}>
      <Typography fontWeight={400} fontSize={25} color={theme.palette.text.primary}>
        Personal Information
      </Typography>

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

      <Stack direction="row" gap={3}>
        <CustomTextField
          type="text"
          label="Day"
          fieldValue="dateOfBirth.day"
          flex={1.5}
          autoComplete="bday-day"
        />

        <Controller
          name="dateOfBirth.month"
          control={control}
          render={({ field: { value, onChange }, formState: { errors } }) => (
            <Stack flex={2}>
              <Selector label="Month" value={value} onChange={onChange} menuItems={months} />
              {get(errors, "dateOfBirth.month")?.message && (
                <FormHelperText error>
                  {get(errors, "dateOfBirth.month").message as string}
                </FormHelperText>
              )}
            </Stack>
          )}
        />

        <CustomTextField
          type="text"
          label="Year"
          fieldValue="dateOfBirth.year"
          flex={1.5}
          autoComplete="bday-year"
        />
      </Stack>

      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isPending}
        disabled={serverError !== null}
      >
        {serverError !== null ? serverError : "Submit"}
      </Button>
    </Stack>
  );
}

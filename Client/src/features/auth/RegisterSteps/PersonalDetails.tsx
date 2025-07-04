import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

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
      />

      <CustomTextField
        type="text"
        label="Lastname"
        fieldValue="lastname"
        startIcon={<PersonOutlineIcon />}
      />

      <Stack direction="row" gap={3}>
        <CustomTextField type="text" label="Day" fieldValue="dateOfBirth.day" flex={1.5} />
        <Controller
          name="dateOfBirth.month"
          control={control}
          render={({ field }) => (
            <Selector
              label="Month"
              value={field.value}
              onChange={field.onChange}
              menuItems={months}
              flex={2}
            />
          )}
        />
        <CustomTextField type="text" label="Year" fieldValue="dateOfBirth.year" flex={1.5} />
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

import { Controller, get, useFormContext } from "react-hook-form";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { CustomFormHeader, CustomTextField, SegmentedDatePicker } from "../components/CustomInputs";

type PersonalDetailsProps = {
  isPending: boolean;
  isContinueDisabled: boolean;
};

export function PersonalDetails({ isPending, isContinueDisabled }: PersonalDetailsProps) {
  const { control } = useFormContext();

  return (
    <Stack gap={1.5} paddingInline={1.5}>
      <CustomFormHeader
        header="Personal details"
        subtext="Let's get to know a bit more about you :)"
        align="flex-start"
      />

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

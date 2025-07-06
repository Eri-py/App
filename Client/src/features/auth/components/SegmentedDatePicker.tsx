import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Selector } from "./Selector";
import FormHelperText from "@mui/material/FormHelperText";
import { useTheme } from "@mui/material/styles";

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

type segmentedDatePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
};

export function SegmentedDatePicker({ value, onChange, error }: segmentedDatePickerProps) {
  let [day, month, year] = value ? value.split("/") : "".split("/");
  if (!day) day = "";
  if (!month) month = "";
  if (!year) year = "";

  const theme = useTheme();

  const handleDayChange = (newDay: string) => {
    onChange(`${newDay}/${month}/${year}`);
  };

  const handleMonthChange = (newMonth: string) => {
    onChange(`${day}/${newMonth}/${year}`);
  };

  const handleYearChange = (newYear: string) => {
    onChange(`${day}/${month}/${newYear}`);
  };

  return (
    <Stack>
      <Stack direction="row" gap={3}>
        <TextField
          type="text"
          variant="outlined"
          label="Day"
          value={day}
          onChange={(e) => handleDayChange(e.target.value)}
          autoComplete="off"
          sx={{ flex: 1.5 }}
          slotProps={{
            input: {
              sx: {
                gap: "0.75rem",
                backgroundColor: theme.palette.background.paper,
              },
            },
          }}
        />

        <Selector
          label="Month"
          value={month}
          onChange={handleMonthChange}
          menuItems={months}
          flex={2}
        />

        <TextField
          type="text"
          variant="outlined"
          label="Year"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          sx={{ flex: 1.5 }}
          autoComplete="off"
          slotProps={{
            input: {
              sx: {
                gap: "0.75rem",
                backgroundColor: theme.palette.background.paper,
              },
            },
          }}
        />
      </Stack>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Stack>
  );
}

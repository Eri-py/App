import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Selector } from "./Selector";

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
};

export function SegmentedDatePicker({ value, onChange }: segmentedDatePickerProps) {
  const [day, month, year] = value ? value.split("/") : "".split("/");

  const handleDayChange = (newDay: string) => {
    onChange(`${newDay}/${month || ""}/${year || ""}`);
  };

  const handleMonthChange = (newMonth: string) => {
    onChange(`${day || ""}/${newMonth}/${year || ""}`);
  };

  const handleYearChange = (newYear: string) => {
    onChange(`${day || ""}/${month || ""}/${newYear}`);
  };

  console.log(value);

  return (
    <Stack direction="row" gap={3}>
      <TextField
        type="text"
        variant="outlined"
        label="Day"
        value={day || ""}
        onChange={(e) => handleDayChange(e.target.value)}
        sx={{ flex: 1.5 }}
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
        value={year || ""}
        onChange={(e) => handleYearChange(e.target.value)}
        sx={{ flex: 1.5 }}
      />
    </Stack>
  );
}

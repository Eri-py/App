import { useTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type SelectorProps = {
  label: string;
  menuItems: string[];
  value: string;
  onChange: (value: string) => void;
};

export function Selector({ label, menuItems, value, onChange }: SelectorProps) {
  const theme = useTheme();

  return (
    <FormControl fullWidth>
      <InputLabel id="label">{label}</InputLabel>
      <Select
        labelId="label"
        value={value || ""}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

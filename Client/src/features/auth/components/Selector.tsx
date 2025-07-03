import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type SelectorProps = {
  label: string;
  menuItems: string[];
  value: string;
  onChange: (value: string) => void;
  flex?: number;
};

export function Selector({ label, menuItems, value, onChange, flex = 1 }: SelectorProps) {
  const items = menuItems.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ));
  return (
    <Box flex={flex}>
      <FormControl fullWidth>
        <InputLabel id="label">{label}</InputLabel>
        <Select
          labelId="label"
          value={value || ""}
          label={label}
          onChange={(e) => onChange(e.target.value)}
        >
          {items}
        </Select>
      </FormControl>
    </Box>
  );
}

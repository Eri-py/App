import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  return (
    <Stack component="form" direction="row" flex={1} maxWidth={720}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        autoComplete="off"
        autoFocus={autoFocus ?? false}
        slotProps={{
          root: {
            sx: { flex: 1 },
          },
          input: {
            startAdornment: <SearchIcon />,
            sx: { borderRadius: 8, gap: 1 },
          },
        }}
      />
    </Stack>
  );
}

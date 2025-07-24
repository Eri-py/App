import { type HTMLAttributes, type Key } from "react";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";

import { type AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

export type SearchOption = {
  name: string;
  category: string;
};

type SearchInputProps = {
  params?: AutocompleteRenderInputParams;
  autoFocus?: boolean;
};

export const SearchInput = ({ params, autoFocus }: SearchInputProps) => {
  return (
    <TextField
      {...params}
      component="form"
      variant="outlined"
      name="search"
      placeholder="Search..."
      autoFocus={autoFocus ?? false}
      slotProps={{
        input: {
          ...params?.InputProps,
          startAdornment: (
            <IconButton disableRipple type="submit">
              <SearchIcon />
            </IconButton>
          ),
          sx: { borderRadius: "2rem", height: "2.5rem" },
        },
      }}
    />
  );
};

type SearchOptionItemProps = {
  props: HTMLAttributes<HTMLLIElement> & { key: Key };
  option: SearchOption;
  onRemove: (option: SearchOption) => void;
};

export const SearchOptionItem = ({ props, option, onRemove }: SearchOptionItemProps) => {
  return (
    <Stack
      {...props}
      key={props.key}
      component="li"
      direction="row"
      borderRadius="2rem"
      justifyContent="space-between !important"
      maxHeight="2.5rem"
      paddingInline="0.75rem 0 !important"
    >
      <Stack direction="row" alignItems="center" gap=".5rem">
        <SearchIcon />
        {option.name}
      </Stack>
      <IconButton
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          onRemove(option);
        }}
      >
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};

type SearchGroupProps = {
  groupKey: number;
  groupName: string;
  inputValue: string;
  children: React.ReactNode;
};

export const SearchGroup = ({ groupKey, groupName, inputValue, children }: SearchGroupProps) => {
  return (
    <Box key={groupKey}>
      <Typography color="primary" fontSize={".85rem"} paddingInline={"1rem"}>
        {inputValue.length === 0 ? `Recent ${groupName}` : groupName}
      </Typography>
      {children}
    </Box>
  );
};

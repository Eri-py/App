import { useState } from "react";
import { SearchBox } from "./SearchBox";

type SearchbarProps = {
  autoFocus?: boolean;
};

export function Searchbar({ autoFocus }: SearchbarProps) {
  const [searchInput, onSearchInputChange] = useState("");

  console.log(searchInput);

  return (
    <SearchBox
      value={searchInput}
      onChange={(e) => onSearchInputChange(e.currentTarget.value)}
      autoFocus={autoFocus ?? false}
    />
  );
}

import { ChangeEvent, KeyboardEvent, useState } from "react";

interface UseSearchOptions {
  onSearch: (searchTerm: string) => void;
}

export function useSearch({ onSearch }: UseSearchOptions) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    const trimmed = searchValue.trim().toLowerCase();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return {
    searchValue,
    handleChange,
    handleKeyDown,
    handleSearch,
    clearSearch,
  };
}

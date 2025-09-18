"use client";
import { FC, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideSearch, LucideX } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange: (val: string) => void;
  debounceMs?: number;
}

const SearchBar: FC<SearchBarProps> = ({ value = "", onChange, debounceMs = 500 }) => {
  const [inputValue, setInputValue] = useState(value);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [inputValue, onChange, debounceMs]);

  return (
    <div className="flex items-center gap-2">
      <LucideSearch className="w-4 h-4 text-gray-500" />
      <Input
        placeholder="Search employees..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-64"
      />
      {inputValue && (
        <Button variant="ghost" size="sm" onClick={() => setInputValue("")}>
          <LucideX className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;

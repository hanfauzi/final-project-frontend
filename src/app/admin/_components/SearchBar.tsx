"use client";
import { FC, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideSearch, LucideX } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange: (val: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({ 
  value = "", 
  onChange, 
  debounceMs = 500, 
  placeholder = "search..." 
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [inputValue, onChange, debounceMs]);

  return (
    <div className="relative w-64">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pr-10" // kasih ruang untuk icon di kanan
      />
      <LucideSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      
      {inputValue && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-10 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => setInputValue("")}
        >
          <LucideX className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;

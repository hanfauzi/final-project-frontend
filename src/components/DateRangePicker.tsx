"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function DateRangePicker({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: { from: string; to: string } | null;
  onChange?: (formatted: { from: string; to: string }) => void;
}) {
  const selected =
    value && value.from && value.to
      ? {
          from: parseISO(value.from),
          to: parseISO(value.to),
        }
      : undefined;

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      onChange?.({
        from: format(range.from, "yyyy-MM-dd"),
        to: format(range.to, "yyyy-MM-dd"),
      });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.({ from: "", to: "" });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full bg-card justify-start text-left font-normal shadow-md",
                !selected && "text-muted-foreground"
              )}
            >
              <span className={cn(selected?.from && "pr-5")}>
                {selected?.from
                  ? selected.to &&
                    selected.from.getTime() !== selected.to.getTime()
                    ? `${format(selected.from, "MMM dd, yyyy")} - ${format(
                        selected.to,
                        "MMM dd, yyyy"
                      )}`
                    : format(selected.from, "MMM dd, yyyy")
                  : "Pick a date"}
              </span>
            </Button>
            {selected?.from && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="text-muted-foreground absolute right-[1px]"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selected?.from}
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={2}
            classNames={{ outside: "text-gray-300" }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

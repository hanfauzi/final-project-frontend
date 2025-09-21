"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Range = { from?: Date; to?: Date };

function toISODate(d?: Date) {
  return d ? format(d, "yyyy-MM-dd") : undefined;
}

function fromToToRange(from?: string, to?: string): Range {
  return {
    from: from ? parseISO(from) : undefined,
    to: to ? parseISO(to) : undefined,
  };
}

function useIsSmall() {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsSmall(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return isSmall;
}

function fmtD(d?: Date) {
  return d ? format(d, "dd-MM-yyyy", { locale: localeId }) : "";
}

export function DateSheet({
  from,
  to,
  onApply,
  onClear,
  separateFields = false, // <-- set true kalau mau field terpisah
}: {
  from?: string;
  to?: string;
  onApply: (f?: string, t?: string) => void;
  onClear: () => void;
  separateFields?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<Range>(() => fromToToRange(from, to));
  const isSmall = useIsSmall();

  const label = useMemo(() => {
    if (from && to) return `${format(parseISO(from), "dd-MM-yyyy")} → ${format(parseISO(to), "dd-MM-yyyy")}`;
    if (from) return `≥ ${format(parseISO(from), "dd-MM-yyyy")}`;
    if (to) return `≤ ${format(parseISO(to), "dd-MM-yyyy")}`;
    return "Semua Tanggal";
  }, [from, to]);

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) setRange(fromToToRange(from, to));
  };

  const apply = () => {
    onApply(toISODate(range.from), toISODate(range.to));
    setOpen(false);
  };

  const clear = () => {
    onClear();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 rounded-full px-3 text-[13px] max-w-[60vw] sm:max-w-none truncate",
          )}
          title={label}
        >
          {label} <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Pilih tanggal</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <Button variant="ghost" className="justify-start" onClick={clear}>
            Semua Tanggal Transaksi
          </Button>

          {separateFields && (
            <div className="grid gap-3">
              <div className="text-sm text-muted-foreground">Dari Tanggal</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {range.from ? fmtD(range.from) : "Pilih tanggal mulai"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  className="p-0 w-[calc(100vw-2rem)] sm:w-auto max-h-[70vh] overflow-auto"
                >
                  <Calendar
                    mode="single"
                    selected={range.from}
                    onSelect={(d) => setRange((r) => ({ ...r, from: d ?? undefined }))}
                    initialFocus
                    locale={localeId}
                    numberOfMonths={isSmall ? 1 : 2}
                  />
                </PopoverContent>
              </Popover>

              <div className="text-sm text-muted-foreground">Sampai Tanggal</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {range.to ? fmtD(range.to) : "Pilih tanggal akhir"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  className="p-0 w-[calc(100vw-2rem)] sm:w-auto max-h-[70vh] overflow-auto"
                >
                  <Calendar
                    mode="single"
                    selected={range.to}
                    onSelect={(d) => setRange((r) => ({ ...r, to: d ?? undefined }))}
                    locale={localeId}
                    numberOfMonths={isSmall ? 1 : 2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button className="w-full" onClick={apply}>
            Terapkan
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

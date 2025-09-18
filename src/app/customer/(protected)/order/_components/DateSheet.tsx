"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export function DateSheet({
  from, to, onApply, onClear,
}: { from?: string; to?: string; onApply: (f?: string, t?: string) => void; onClear: () => void; }) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(from ?? "");
  const [end, setEnd] = useState(to ?? "");

  const label = useMemo(() => {
    if (from && to) return `${from} → ${to}`;
    if (from) return `≥ ${from}`;
    if (to) return `≤ ${to}`;
    return "Semua Tanggal";
  }, [from, to]);

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (o) { setStart(from ?? ""); setEnd(to ?? ""); } }}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-9 rounded-full px-3 text-[13px]">
          {label} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl">
        <SheetHeader><SheetTitle>Pilih tanggal</SheetTitle></SheetHeader>
        <div className="py-4 space-y-3">
          <Button variant="ghost" className="justify-start"
            onClick={() => { onClear(); setOpen(false); }}>
            Semua Tanggal Transaksi
          </Button>

          <div className="grid gap-2">
            <div className="text-sm text-neutral-600">Pilih Tanggal Sendiri</div>
            <div className="flex gap-2">
              <Input type="date" value={start} onChange={e=>setStart(e.target.value)} />
              <Input type="date" value={end} onChange={e=>setEnd(e.target.value)} />
            </div>
          </div>

          <Button className="w-full"
            onClick={() => { onApply(start || undefined, end || undefined); setOpen(false); }}>
            Terapkan
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export function InfoBox({
  icon,
  label,
  value,
  copyable,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 text-neutral-500">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-neutral-900 break-all">{value || "—"}</span>
        {copyable ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-neutral-500 hover:text-neutral-900"
            onClick={() => navigator.clipboard.writeText(value)}
            aria-label={`Salin ${label}`}
            title="Salin"
          >
            <Copy className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
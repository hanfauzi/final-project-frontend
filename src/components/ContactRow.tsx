import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export function ContactRow({
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
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 grid place-items-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-sm font-medium text-foreground break-all">{value || "—"}</div>
        </div>
      </div>
      {copyable ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-accent"
          onClick={() => navigator.clipboard.writeText(value)}
          aria-label={`Salin ${label}`}
          title="Salin"
        >
          <Copy className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

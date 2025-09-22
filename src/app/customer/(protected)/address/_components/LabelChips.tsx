import { LabelEnum } from "../_hooks/useEditAddress";

const LABELS: { key: LabelEnum; ui: string }[] = [
  { key: "HOME", ui: "Rumah" },
  { key: "OFFICE", ui: "Kantor" },
  { key: "APARTMENT", ui: "Apartemen" },
  { key: "OTHER", ui: "Lainnya" },
];

export function LabelChips({
  value,
  onChange,
}: {
  value: LabelEnum;
  onChange: (v: LabelEnum) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {LABELS.map((opt) => (
        <button
          type="button"
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={[
            "h-8 px-3 rounded-full border text-sm transition",
            value === opt.key
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-accent",
          ].join(" ")}
        >
          {opt.ui}
        </button>
      ))}
    </div>
  );
}

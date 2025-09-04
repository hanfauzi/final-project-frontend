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
            "h-8 px-3 rounded-full border text-sm",
            value === opt.key
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50",
          ].join(" ")}
        >
          {opt.ui}
        </button>
      ))}
    </div>
  );
}

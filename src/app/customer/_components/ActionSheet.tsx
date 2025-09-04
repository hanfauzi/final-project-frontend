import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ActionSheet({
  open,
  onClose,
  onMakePrimaryAndSelect,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  onMakePrimaryAndSelect: () => void;
  onDelete: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-2xl border-t border-neutral-200">
        <div className="p-4 flex items-center justify-between">
          <div className="font-semibold text-neutral-900">Pilihan lainnya</div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
        <Separator />
        <div className="divide-y divide-neutral-200">
          <button
            className="w-full text-left px-4 py-3 hover:bg-neutral-50"
            onClick={() => {
              onMakePrimaryAndSelect();
              onClose();
            }}
          >
            Jadikan Alamat Utama dan Pilih
          </button>
          <button
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Hapus Alamat
          </button>
        </div>
        <div className="h-3" />
      </div>
    </div>
  );
}
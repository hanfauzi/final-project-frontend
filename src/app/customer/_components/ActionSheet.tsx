import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    <div className="fixed inset-0 z-[40]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      {/* sheet */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-background text-foreground shadow-2xl border-t border-border"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="font-semibold">Pilihan lainnya</div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>

        <Separator />

        <div className="divide-y divide-border">
          <button
            className="w-full text-left px-4 py-3 hover:bg-accent"
            onClick={() => {
              onMakePrimaryAndSelect();
              onClose();
            }}
          >
            Jadikan Alamat Utama dan Pilih
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full text-left px-4 py-3 text-destructive hover:bg-accent">
                Hapus Alamat
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Alamat?</AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan menghapus alamat ini. Alamat yang sudah dihapus tidak dapat
                  dikembalikan dan dipakai lagi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="h-3" />
      </div>
    </div>
  );
}

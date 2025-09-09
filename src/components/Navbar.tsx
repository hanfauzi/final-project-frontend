"use client";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
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
export function Navbar() {
  const router = useRouter();
  const customer = useAuthStore((s) => s.customer);
  const employee = useAuthStore((s) => s.employee);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const loggedIn = Boolean(
    customer?.token ?? employee?.token ?? customer?.id ?? employee?.id
  );

  const items = useMemo(() => {
    if (!loggedIn) {
      return [
        { label: "Home", href: "/" },
        { label: "Service", href: "#services" },
        { label: "About Us", href: "#about" },
      ] as const;
    }
    return [
      { label: "Home", href: "/" },
      { label: "Profile", href: "/customer/profile" },
      { label: "Service", href: "#services" },
      { label: "Address", href: "/customer/address" },
      { label: "Transaction", href: "/customer/transactions" },
      { label: "About Us", href: "#about" },
    ] as const;
  }, [loggedIn]);

  return (
    <div className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur">
      <div className="mx-auto w-full max-w-sm h-12 px-4 flex items-center justify-between">
        <span className="inline-flex w-6" />
        <div className="text-[17px] font-bold tracking-tight text-neutral-900 select-none">
          <Link
            href="/"
            className="inline-block px-2 py-1 -mx-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            aria-label="Ke beranda"
          >
            Laundr
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88%] sm:w-80 p-0">
            <SheetHeader className="px-4 py-3 border-b border-neutral-200">
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <nav className="px-1 py-2">
              {items.map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className="block px-3 py-3 text-[15px] text-neutral-900 active:bg-neutral-100"
                >
                  {it.label}
                </Link>
              ))}

              {!loggedIn ? (
                <div className="px-3 pt-2 pb-3 grid grid-cols-2 gap-2">
                  <Button className="inline-flex items-center justify-center h-11 rounded-xl border border-neutral-300">
                    <Link href="/customer/login">Login</Link>
                  </Button>
                  <Button className="inline-flex items-center justify-center h-11 rounded-xl border border-neutral-300">
                    <Link href="/customer/register">Register</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Separator className="my-2" />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        className="mx-3 mb-3 inlineF-flex items-center justify-center h-11 w-[calc(100%-1.5rem)] rounded-xl bg-neutral-900 text-white"
                      >
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Kamu akan keluar dari Laundr di perangkat ini.
                          Pastikan perubahan sudah disimpan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            clearAuth();
                            router.refresh();
                          }}
                        >
                          Keluar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

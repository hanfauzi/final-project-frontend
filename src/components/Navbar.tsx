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
import Image from "next/image";

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
      return [] as const;
    }
    return [
      { label: "Profil", href: "/customer/profile" },
      { label: "Alamat", href: "/customer/address" },
      { label: "Transaksi", href: "/customer/order" },
      {label: "Buat Pesanan", href: "/customer/order/create" },
    ] as const;
  }, [loggedIn]);

  return (
    <div className="sticky top-0 z-50">
      <header
        className={[
          ,
          "border-b border-border/60",
          "bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "shadow-[0_2px_18px_rgba(0,0,0,0.06)] transition-colors",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-sm h-12 px-4 flex items-center justify-between md:max-w-5xl md:h-14 md:px-6">
          <span className="inline-flex w-6 md:hidden" />
          <div className="font-bold tracking-tight text-foreground select-none">
            <Link
              href="/"
              aria-label="Ke beranda"
              className="inline-flex items-center px-2 py-1 -mx-2"
            >
              <div className="relative h-7 w-[112px] sm:h-8 sm:w-[128px] md:h-9 md:w-[150px] shrink-0">
                <Image
                  src="/logo-text-laundr.png"
                  alt="Laundr"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 128px, 150px"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:gap-5">
            {items.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                className="text-[15px] text-muted-foreground hover:text-foreground"
              >
                {it.label}
              </Link>
            ))}
            {!loggedIn ? (
              <div className="ml-2 flex items-center gap-2">
                <Button asChild variant="outline" className="h-10 rounded-xl">
                  <Link href="/customer/login">Masuk</Link>
                </Button>
                <Button asChild className="h-10 rounded-xl">
                  <Link href="/customer/register">Daftar</Link>
                </Button>
              </div>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-10 rounded-xl"
                  >
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Kamu akan keluar dari Laundr di perangkat ini. Pastikan
                      perubahan sudah disimpan.
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
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88%] sm:w-80 p-0">
              <SheetHeader className="px-4 py-3 border-b border-border">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="px-1 py-2">
                {items.map((it) => (
                  <Link
                    key={it.label}
                    href={it.href}
                    className="block px-3 py-3 text-[15px] text-foreground active:bg-accent"
                  >
                    {it.label}
                  </Link>
                ))}

                {!loggedIn ? (
                  <div className="px-3 pt-2 pb-3 grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 rounded-xl"
                    >
                      <Link href="/customer/login">Masuk</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 rounded-xl"
                    >
                      <Link href="/customer/register">Daftar</Link>
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
                          className="mx-3 mb-3 inline-flex items-center justify-center h-11 w-[calc(100%-1.5rem)] rounded-xl"
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
      </header>
    </div>
  );
}

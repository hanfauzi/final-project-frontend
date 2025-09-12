"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import useVerifyEmail from "../../_hooks/useVerifyEmail";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  // destructure the stable mutate function + states
  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    data,
    error,
  } = useVerifyEmail();

  useEffect(() => {
    if (!token) return;
    mutate(token, {
      onSuccess: (res) => {
        toast.success(res?.message ?? "Email verified!");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? "Invalid or expired link.");
      },
    });
  }, [token, mutate]); 

  const pending = isPending;
  const success = isSuccess;
  const failed = isError;

  return (
    <>
      <Head><title>Verifying Email • Laundr</title></Head>
      <div className="relative min-h-screen bg-neutral-50">
        <div className="mx-auto w-full max-w-sm px-4 py-6">
          <Card className="rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-semibold text-neutral-800">
                Verifikasi Email
              </CardTitle>
              <p className="mt-1 text-sm text-neutral-500">Kami sedang memproses tautan verifikasimu</p>
            </CardHeader>

            <CardContent className="py-6 grid place-items-center gap-4">
              {pending && (
                <div className="grid place-items-center gap-3" role="status" aria-live="polite">
                  <LoaderCircle className="h-7 w-7 animate-spin text-neutral-700" />
                  <p className="text-sm text-neutral-600">Memverifikasi email…</p>
                </div>
              )}

              {success && (
                <div className="grid w-full place-items-center gap-4" aria-live="polite">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  <p className="text-sm text-neutral-700 text-center">
                    {data?.message ?? "Email kamu berhasil diverifikasi."}
                  </p>
                  <Button
                    className="w-full h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99]"
                    onClick={() => router.replace("/customer/login")}
                  >
                    Masuk sekarang
                  </Button>
                  <Link href="/" className="text-xs text-neutral-500 underline underline-offset-2">
                    Kembali ke beranda
                  </Link>
                </div>
              )}

              {failed && (
                <div className="grid w-full place-items-center gap-4" aria-live="polite">
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                  <p className="text-sm text-neutral-700 text-center">
                    {error?.response?.data?.message ?? "Tautan verifikasi tidak valid atau sudah kedaluwarsa."}
                  </p>
                  <div className="flex w-full gap-2">
                    <Button variant="outline" className="w-1/2 h-12 rounded-xl" onClick={() => token && mutate(token)}>
                      Coba lagi
                    </Button>
                    <Button className="w-1/2 h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99]"
                            onClick={() => router.push("/customer/verify")}>
                      Kirim ulang email
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}

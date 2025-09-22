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
      <div className="relative min-h-screen bg-background md:flex md:items-center md:justify-center md:p-6"> 
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-50 md:opacity-60" 
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        /> 
        <div className="mx-auto w-full max-w-sm px-4 py-6 md:max-w-md md:px-6 md:py-8"> 
          <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)] md:rounded-3xl md:shadow-xl"> 
            <CardHeader className="text-center pb-2 md:pb-3"> 
              <CardTitle className="text-lg font-semibold text-foreground md:text-xl"> 
                Verifikasi Email
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground md:text-[0.95rem]"> 
                Kami sedang memproses tautan verifikasimu
              </p>
            </CardHeader>

            <CardContent className="py-6 grid place-items-center gap-4 md:py-8 md:px-6"> 
              {pending && (
                <div className="grid place-items-center gap-3" role="status" aria-live="polite">
                  <LoaderCircle className="h-7 w-7 animate-spin text-muted-foreground md:h-8 md:w-8" /> 
                </div>
              )}

              {success && (
                <div className="grid w-full place-items-center gap-4" aria-live="polite">
                  <CheckCircle2 className="h-8 w-8 text-primary md:h-9 md:w-9" /> 
                  <p className="text-sm text-foreground text-center md:text-[0.95rem]"> 
                    {data?.message ?? "Email kamu berhasil diverifikasi."}
                  </p>
                  <Button
                    className="w-full h-12 rounded-xl md:h-12"
                    onClick={() => router.replace("/customer/login")}
                  >
                    Masuk sekarang
                  </Button>
                  <Link href="/" className="text-xs text-primary underline underline-offset-2 md:text-sm"> 
                    Kembali ke beranda
                  </Link>
                </div>
              )}

              {failed && (
                <div className="grid w-full place-items-center gap-4" aria-live="polite">
                  <AlertTriangle className="h-8 w-8 text-destructive md:h-9 md:w-9" /> 
                  <p className="text-sm text-foreground text-center md:text-[0.95rem]"> 
                    {error?.response?.data?.message ?? "Tautan verifikasi tidak valid atau sudah kedaluwarsa."}
                  </p>
                  <div className="flex w-full gap-2">
                    <Button variant="outline" className="w-1/2 h-12 rounded-xl" onClick={() => token && mutate(token)}>
                      Coba lagi
                    </Button>
                    <Button className="w-1/2 h-12 rounded-xl" onClick={() => router.push("/customer/verify")}>
                      Kirim ulang email
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="h-6 md:h-8" /> 
        </div>
      </div>
    </>
  );
}

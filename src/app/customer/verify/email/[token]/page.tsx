"use client";

import Head from "next/head";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import useVerifyEmail from "@/app/customer/_hooks/useVerifyEmail";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const verify = useVerifyEmail();

  useEffect(() => {
    if (!token) return;
    verify.mutate(token, {
      onSuccess: (res) => {
        toast.success(res?.message ?? "Email verified!");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message ?? "Invalid or expired link.");
      },
    });
  }, [token]);

  const pending = verify.isPending;
  const success = verify.isSuccess;
  const failed = verify.isError;

  return (
    <>
      <Head>
        <title>Verifying Email • Laundr</title>
      </Head>

      <div className="min-h-screen grid place-items-center bg-neutral-50 px-4">
        <Card className="w-full max-w-[420px] rounded-2xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <CardHeader className="text-center pt-8">
            <div className="text-2xl font-black tracking-tight text-neutral-900">Laundr</div>
            <p className="mt-1 text-sm text-neutral-600">Email Verification</p>
          </CardHeader>

          <CardContent className="py-8 grid place-items-center gap-4">
            {pending && (
              <>
                <LoaderCircle className="h-6 w-6 animate-spin text-neutral-700" />
                <p className="text-sm text-neutral-600">Verifying your email…</p>
              </>
            )}

            {success && (
              <>
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                <p className="text-sm text-neutral-700 text-center">
                  {verify.data?.message ?? "Your email has been verified."}
                </p>
                <Button
                  className="w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
                  onClick={() => router.replace("/customer/login")}
                >
                  Go to Login
                </Button>
              </>
            )}

            {failed && (
              <>
                <AlertTriangle className="h-7 w-7 text-amber-600" />
                <p className="text-sm text-neutral-700 text-center">
                  {verify.error?.response?.data?.message ?? "Invalid or expired verification link."}
                </p>
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    className="w-1/2 rounded-xl"
                    onClick={() => verify.mutate(token)}
                  >
                    Try Again
                  </Button>
                  <Button
                    className="w-1/2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
                    onClick={() => router.push("/customer/verify")}
                  >
                    Resend Email
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

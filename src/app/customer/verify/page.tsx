"use client";

import Head from "next/head";
import { useFormik } from "formik";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { validationCustomerRegisterSchema } from "@/features/customer/register/validationCustomerRegisterSchemas";
import useResendVerifyEmail from "../_hooks/useResendVerifyEmail";

export default function ResendVerificationPage() {
  const { resendVerifyEmailMutation } = useResendVerifyEmail();
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: validationCustomerRegisterSchema,
    onSubmit: (values) => {
      resendVerifyEmailMutation.mutate(values);
    },
  });
  const pending = resendVerifyEmailMutation.isPending;

  return (
    <>
      <Head>
        <title>Kirim Ulang Verifikasi • Laundr</title>
      </Head>

      <div className="min-h-screen bg-neutral-50 grid place-items-center px-4">
        <Card className="w-full max-w-[420px] rounded-2xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <CardHeader className="pb-3 text-center">
            <div className="text-2xl font-black tracking-tight text-neutral-900">
              Laundr
            </div>
            <CardTitle className="mt-1 text-base font-medium text-neutral-600">
              Kirim Ulang Verifikasi
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-2">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4"
              aria-busy={pending}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email yang kamu daftarkan"
                  autoComplete="email"
                  disabled={pending}
                  {...formik.getFieldProps("email")}
                  className={`h-11 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-400"
                      : ""
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-red-500" role="alert">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="h-11 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
              >
                {pending ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Ulang Email Verifikasi"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

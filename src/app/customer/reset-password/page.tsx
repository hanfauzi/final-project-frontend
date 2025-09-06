"use client";

import Head from "next/head";
import Link from "next/link";
import { useFormik } from "formik";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { validationCustomerRegisterSchema } from "@/features/customer/register/validationCustomerRegisterSchemas";
import useSendResetPasswordEmail from "../_hooks/useSendResetPasswordEmail";

export default function ResetPasswordRequestPage() {
  const { sendResetPasswordEmailMutation } = useSendResetPasswordEmail();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: validationCustomerRegisterSchema,
    onSubmit: (values) => {
      sendResetPasswordEmailMutation.mutate(values);
    },
  });

  const pending = sendResetPasswordEmailMutation.isPending;

  return (
    <>
      <Head>
        <title>Kirim Link Reset • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-neutral-50">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="mx-auto w-full max-w-sm px-4 py-6">
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neutral-900 text-white font-bold">
                L
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900">
                Laundr
              </div>
            </div>
          </div>

          <Card className="rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-lg font-semibold text-neutral-800">
                Reset password
              </CardTitle>
              <p className="mt-1 text-sm text-neutral-500">
                Masukkan email terdaftar, kami akan mengirim tautan reset.
              </p>
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
                    placeholder="nama@email.com"
                    inputMode="email"
                    autoComplete="email"
                    disabled={pending}
                    {...formik.getFieldProps("email")}
                    className={`h-12 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
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
                  className="h-12 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99] disabled:opacity-70"
                >
                  {pending ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </Button>

                <div className="space-y-2 pt-2">
                  <p className="text-center text-sm text-neutral-600">
                    Ingat password?{" "}
                    <Link
                      href="/customer/login"
                      className="font-medium text-neutral-900 underline underline-offset-2"
                    >
                      Kembali masuk
                    </Link>
                  </p>
                  <p className="text-center text-xs text-neutral-500">
                    Tidak menerima email? Cek folder{" "}
                    <span className="font-medium">Spam</span> /{" "}
                    <span className="font-medium">Promotions</span>.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="h-6" />
        </div>
      </div>
    </>
  );
}

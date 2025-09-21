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
import useSendResetPasswordEmail from "../verify/_hooks/useSendResetPasswordEmail";

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

      <div className="relative min-h-screen bg-background">
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
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold">
                L
              </span>
              <div className="text-2xl font-black tracking-tight text-foreground">
                Laundr
              </div>
            </div>
          </div>

          <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-lg font-semibold text-foreground">
                Reset password
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
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
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukan Email"
                    inputMode="email"
                    autoComplete="email"
                    disabled={pending}
                    {...formik.getFieldProps("email")}
                    className={`h-12 rounded-xl focus-visible:ring-ring ${
                      formik.touched.email && formik.errors.email
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-destructive" role="alert">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={pending}
                  className="h-12 w-full rounded-xl active:scale-[.99] disabled:opacity-70"
                >
                  {pending ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </Button>

                <div className="space-y-2 pt-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Ingat password?{" "}
                    <Link
                      href="/customer/login"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      Kembali masuk
                    </Link>
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
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

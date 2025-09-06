"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import useSetPassword from "@/app/customer/_hooks/useSetPassword";
import { validationSetPasswordSchema } from "@/features/customer/verify/schema/validationSetPasswordSchema";

export default function SetPasswordPage() {
  const { setPasswordMutation } = useSetPassword();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: validationSetPasswordSchema,
    onSubmit: (values) => {
      setPasswordMutation.mutate({ password: values.password });
    },
  });

  const pending = setPasswordMutation.isPending;

  return (
    <>
      <Head>
        <title>Setel Kata Sandi • Laundr</title>
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
                Setel kata sandi
              </CardTitle>
              <p className="mt-1 text-sm text-neutral-500">
                Buat password baru untuk akunmu
              </p>
            </CardHeader>

            <CardContent className="pt-2">
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4"
                aria-busy={pending}
              >
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-neutral-900">
                    Password Baru
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showNew ? "text" : "password"}
                      placeholder="Masukkan password baru"
                      autoComplete="new-password"
                      disabled={pending}
                      {...formik.getFieldProps("password")}
                      className={`h-12 pr-11 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-400"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      disabled={pending}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-neutral-500 hover:text-neutral-800"
                      aria-label={
                        showNew
                          ? "Sembunyikan password baru"
                          : "Tampilkan password baru"
                      }
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-xs text-red-500" role="alert">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-neutral-900">
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      autoComplete="new-password"
                      disabled={pending}
                      {...formik.getFieldProps("confirmPassword")}
                      className={`h-12 pr-11 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border-red-400"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      disabled={pending}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-neutral-500 hover:text-neutral-800"
                      aria-label={
                        showConfirm
                          ? "Sembunyikan konfirmasi password"
                          : "Tampilkan konfirmasi password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-xs text-red-500" role="alert">
                        {formik.errors.confirmPassword}
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
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Password"
                  )}
                </Button>

                <div className="space-y-2 pt-2">
                  <p className="text-center text-sm text-neutral-600">
                    Sudah ingat password?{" "}
                    <Link
                      href="/customer/login"
                      className="font-medium text-neutral-900 underline underline-offset-2"
                    >
                      Kembali masuk
                    </Link>
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

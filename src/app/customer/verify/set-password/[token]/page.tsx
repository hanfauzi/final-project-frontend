"use client";

import Head from "next/head";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import useSetPassword from "@/app/customer/_hooks/useSetPassword";
import { useFormik } from "formik";
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

      <div className="min-h-screen bg-neutral-50 grid place-items-center px-4">
        <Card className="w-full max-w-[420px] rounded-2xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <CardHeader className="pb-3 text-center">
            <div className="text-2xl font-black tracking-tight text-neutral-900">
              Laundr
            </div>
            <CardTitle className="mt-1 text-base font-medium text-neutral-600">
              Setel Kata Sandi
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-2">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4"
              aria-busy={pending}
            >
              {/* Password Baru */}
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
                    className={`h-11 pr-10 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-400"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    disabled={pending}
                    className="absolute inset-y-0 right-0 px-3 grid place-items-center text-neutral-500 hover:text-neutral-800"
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

              {/* Konfirmasi Password */}
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
                    className={`h-11 pr-10 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
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
                    className="absolute inset-y-0 right-0 px-3 grid place-items-center text-neutral-500 hover:text-neutral-800"
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
                className="h-11 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
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
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

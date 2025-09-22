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
import { validationSetPasswordSchema } from "@/features/customer/verify/schema/validationSetPasswordSchema";
import useResetPassword from "../_hooks/useResetPassword";
import Image from "next/image"; 

export default function ResetPasswordPage() {
  const { resetPasswordMutation } = useResetPassword();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: validationSetPasswordSchema,
    onSubmit: (values) => {
      resetPasswordMutation.mutate(values);
    },
  });

  const pending = resetPasswordMutation.isPending;

  return (
    <>
      <Head>
        <title>Reset Password • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-background md:flex md:items-center md:justify-center md:p-6"> 
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 md:opacity-70" 
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="mx-auto w-full max-w-sm px-4 py-6 md:max-w-md md:px-6 md:py-8"> 
          <div className="mb-4 flex items-center justify-center md:mb-6"> 
            <div className="inline-flex items-center gap-2">
              <span className="sr-only">L</span> 
              <div className="text-2xl font-black tracking-tight text-foreground md:text-3xl"> 
                <Image
                  src="/logo-text-laundr.png"
                  alt="Laundr"
                  width={160}
                  height={40}
                  priority
                /> 
              </div>
            </div>
          </div>

          <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)] md:rounded-3xl md:shadow-xl"> 
            <CardHeader className="pb-2 text-center md:pb-3"> 
              <CardTitle className="text-lg font-semibold text-foreground md:text-xl"> 
                Buat password baru
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground md:text-[0.95rem]"> 
                Masukkan password baru dan konfirmasi untuk menyelesaikan reset.
              </p>
            </CardHeader>

            <CardContent className="pt-2 md:pt-3 md:px-6"> 
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4 md:space-y-5" 
                aria-busy={pending}
              >
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
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
                      className={`h-12 pr-11 rounded-xl focus-visible:ring-ring md:h-12 md:text-base ${ 
                        formik.touched.password && formik.errors.password
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      disabled={pending}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                      aria-label={
                        showNew
                          ? "Sembunyikan password baru"
                          : "Tampilkan password baru"
                      }
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> 
                      ) : (
                        <Eye className="h-4 w-4 md:h-5 md:w-5" /> 
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-xs text-destructive md:text-sm" role="alert"> 
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
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
                      className={`h-12 pr-11 rounded-xl focus-visible:ring-ring md:h-12 md:text-base ${ 
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      disabled={pending}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                      aria-label={
                        showConfirm
                          ? "Sembunyikan konfirmasi password"
                          : "Tampilkan konfirmasi password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> 
                      ) : (
                        <Eye className="h-4 w-4 md:h-5 md:w-5" /> 
                      )}
                    </button>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-xs text-destructive md:text-sm" role="alert"> 
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  disabled={pending}
                  className="h-12 w-full rounded-xl active:scale-[.99] disabled:opacity-70 md:h-12 md:text-base" 
                >
                  {pending ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin md:h-5 md:w-5" /> 
                    </span>
                  ) : (
                    "Simpan Password"
                  )}
                </Button>

                <div className="space-y-2 pt-2">
                  <p className="text-center text-sm text-muted-foreground md:text-[0.95rem]"> 
                    Sudah ingat password?{" "}
                    <Link
                      href="/customer/login"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      Kembali masuk
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

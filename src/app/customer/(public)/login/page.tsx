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
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import useLoginHook from "./_hooks/useLogin";
import { validationCustomerLoginSchema } from "@/features/customer/login/schema/validationCustomerLoginSchema";
import { useGoogleAuth } from "../register/_hooks/useGoogleAuth";

export default function LoginPage() {
  const { loginCustomerMutation } = useLoginHook();
  const googleAuth = useGoogleAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationCustomerLoginSchema,
    onSubmit: (values) => {
      loginCustomerMutation.mutate(values);
    },
  });

  const pending = loginCustomerMutation.isPending;

  return (
    <>
      <Head>
        <title>Masuk • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-neutral-50">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 400px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
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
                Selamat datang kembali
              </CardTitle>
              <p className="mt-1 text-sm text-neutral-500">
                Masuk untuk melanjutkan pesananmu
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-neutral-900">
                      Password
                    </Label>
                    <Link
                      href="/customer/reset-password"
                      className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
                    >
                      Lupa password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
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
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={pending}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-neutral-500 hover:text-neutral-800"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? (
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

                <Button
                  type="submit"
                  disabled={pending}
                  className="h-12 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99] disabled:opacity-70"
                >
                  {pending ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Masuk...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                <div className="my-2 flex items-center gap-3">
                  <span className="h-px flex-1 bg-neutral-200" />
                  <span className="text-xs text-neutral-500">atau</span>
                  <span className="h-px flex-1 bg-neutral-200" />
                </div>

                <div className="grid place-items-center">
                  <GoogleLogin
                    onSuccess={(cred) => {
                      const idToken = cred.credential;
                      if (!idToken)
                        return toast.error("Google tidak mengirim token.");
                      googleAuth.mutate(idToken);
                    }}
                    onError={() => toast.error("Gagal login dengan Google.")}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="pill"
                    width="320"
                    locale="id"
                  />
                </div>
              </form>

              <p className="mt-4 text-center text-sm text-neutral-500">
                Belum punya akun?{" "}
                <Link
                  href="/customer/register"
                  className="font-medium text-neutral-900 underline underline-offset-2"
                >
                  Daftar
                </Link>
              </p>
            </CardContent>
          </Card>

          <div className="h-6" />
        </div>
      </div>
    </>
  );
}

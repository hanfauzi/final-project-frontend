"use client";

import Head from "next/head";
import { useState } from "react";
import { useFormik } from "formik";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import useLoginHook from "../_hooks/useLogin";
import { validationCustomerLoginSchema } from "@/features/customer/login/schema/validationCustomerLoginSchema";
import { useGoogleAuth } from "../_hooks/useGoogleAuth";

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

      <div className="min-h-screen bg-neutral-50 grid place-items-center px-4">
        <Card className="w-full max-w-[420px] rounded-2xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <CardHeader className="pb-3 text-center">
            <div className="text-2xl font-black tracking-tight text-neutral-900">
              Laundr
            </div>
            <CardTitle className="mt-1 text-base font-medium text-neutral-600">
              Masuk
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-2">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4"
              aria-busy={pending}
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
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

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-900">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
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
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={pending}
                    className="absolute inset-y-0 right-0 px-3 grid place-items-center text-neutral-500 hover:text-neutral-800"
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={pending}
                className="h-11 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
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

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs text-neutral-500">atau</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              {/* Login dengan Google */}
              <div className="w-full grid place-items-center">
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
                  text="signup_with"
                  shape="pill"
                  width="356"
                  locale="id"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

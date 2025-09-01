"use client";

import Head from "next/head";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useFormik } from "formik";
import { validationCustomerRegisterSchema } from "@/features/customer/register/validationCustomerRegisterSchemas";
import useRegisterHook from "../_hooks/useRegister";
import { useGoogleAuth } from "../_hooks/useGoogleAuth";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import Link from "next/link";

function RegisterPage() {
  const { registerCustomerMutation } = useRegisterHook();
  const googleAuth = useGoogleAuth();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: validationCustomerRegisterSchema,
    onSubmit: (values) => registerCustomerMutation.mutate(values),
  });

  const pending = registerCustomerMutation.isPending;

  return (
    <>
      <Head><title>Daftar Laundr</title></Head>

      <div className="min-h-screen bg-neutral-50 grid place-items-center px-4">
        <Card className="w-full max-w-[420px] rounded-2xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <CardHeader className="pb-3 text-center">
            <div className="text-2xl font-black tracking-tight text-neutral-900">Laundr</div>
            <CardTitle className="mt-1 text-base font-medium text-neutral-600">Buat Akun</CardTitle>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-900">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan Email"
                  {...formik.getFieldProps("email")}
                  autoComplete="email"
                  disabled={pending}
                  className={formik.touched.email && formik.errors.email ? "border-red-400" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-red-500" role="alert">{formik.errors.email}</p>
                )}
              </div>

              <Button type="submit" disabled={pending}
                className="h-11 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800">
                {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Daftar"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs text-neutral-500">atau</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              {/* Google Login → kirim ID token ke backend */}
              <div className="w-full grid place-items-center">
                <GoogleLogin
                  onSuccess={(cred) => {
                    const idToken = cred.credential;
                    if (!idToken) return toast.error("Google tidak mengirim token.");
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

                <p className="mt-4 text-center text-sm text-neutral-600">
  Belum menerima email verifikasi?{" "}
  <Link
    href="/customer/verify"
    className="text-neutral-900 font-medium underline underline-offset-4"
  >
    Kirim ulang
  </Link>
</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default RegisterPage;

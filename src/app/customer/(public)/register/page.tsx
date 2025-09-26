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
import useRegisterHook from "./_hooks/useRegister";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import Image from "next/image"; 
import { useGoogleLogin } from "./_hooks/useGoogleLogin";

function RegisterPage() {
  const { registerCustomerMutation } = useRegisterHook();
  const googleLogin = useGoogleLogin();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: validationCustomerRegisterSchema,
    onSubmit: (values) => registerCustomerMutation.mutate(values),
  });

  const pending = registerCustomerMutation.isPending;

  return (
    <>
      <Head>
        <title>Daftar • Laundr</title>
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
                Buat akun baru
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground md:text-[0.95rem]"> 
                Daftar dengan email untuk mulai menggunakan Laundr
              </p>
            </CardHeader>

            <CardContent className="pt-2 md:pt-3 md:px-6"> 
              <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-5" aria-busy={pending}> 
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
                    className={`h-12 rounded-xl focus-visible:ring-ring md:h-12 md:text-base ${ 
                      formik.touched.email && formik.errors.email ? "border-destructive" : ""
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-destructive md:text-sm" role="alert"> 
                      {formik.errors.email}
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
                    "Daftar"
                  )}
                </Button>

                <div className="my-2 flex items-center gap-3 md:my-3"> 
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground md:text-sm">atau</span> 
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="grid place-items-center">
                  <GoogleLogin
                    onSuccess={(cred) => {
                      const idToken = cred.credential;
                      if (!idToken) return toast.error("Google tidak mengirim token.");
                      googleLogin.mutate(idToken);
                    }}
                    onError={() => toast.error("Gagal login dengan Google.")}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="pill"
                    width="320"
                    locale="id"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-center text-sm text-muted-foreground mb-4 md:text-[0.95rem] md:mb-6"> 
                    Sudah punya akun?{" "}
                    <Link href="/customer/login" className="font-medium text-primary underline underline-offset-2">
                      Masuk
                    </Link>
                  </p>
                  <p className="text-center text-sm text-muted-foreground mb-8 md:mb-6 md:text-[0.95rem]"> 
                    Belum menerima email verifikasi?{" "}
                    <Link href="/customer/verify" className="text-primary font-medium underline underline-offset-2">
                      Kirim ulang
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="h-6 md:h-8" /> 
        </div>
      </div>
    </>
  );
}

export default RegisterPage;

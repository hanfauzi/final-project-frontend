"use client";

import Head from "next/head";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Daftar Laundr</title>
      </Head>

      <div className="min-h-screen bg-neutral-50 grid place-items-center px-4">
        <Card className="w-full max-w-[420px] rounded-2xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <CardHeader className="pb-3">
            <div className="text-center">
              <div className="text-2xl font-black tracking-tight text-neutral-900">
                Laundr
              </div>
              <CardTitle className="mt-1 text-base font-medium text-neutral-600">
                Buat Akun
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {/* === FORM: EMAIL ONLY === */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: sambungkan ke action/hook register-mu
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                  className="h-11 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900"
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Daftar
              </Button>

              {/* Divider “atau” */}
              <div className="flex items-center gap-3 my-2">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs text-neutral-500">atau</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              {/* Register with Google */}
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl border-neutral-300 text-neutral-900 hover:bg-neutral-100"
                onClick={() => {
                  // TODO: sambungkan ke Google OAuth
                }}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Daftar dengan Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/** Ikon Google (inline, no extra deps) */
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.7-5.5 3.7-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.3 0 8.8-4.4 8.8-6.7 0-.5-.1-.9-.2-1.2H12z"
      />
      <path fill="#34A853" d="M3.7 7.3l3.2 2.3C7.6 8 9.6 6.4 12 6.4c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3 14.7 2 12 2 8.6 2 5.6 3.6 3.7 7.3z" />
      <path fill="#FBBC05" d="M12 20.4c3 0 5.5-1 7.3-2.7l-3.1-2.6c-1 .7-2.3 1.2-4.2 1.2-3.8 0-5.3-2.4-5.5-3.7l-3.2 2.5C5.6 18.9 8.6 20.4 12 20.4z" />
      <path fill="#4285F4" d="M20.8 13.7c.1-.3.2-.7.2-1.2 0-.4 0-.9-.1-1.3H12v3.9h8.8z" />
    </svg>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Head from "next/head";
import { useState } from "react";
import * as Yup from "yup";
import useEmployeeLogin from "../hooks/useAuthEmployee";

const SuperAdminLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(8, "Minimal 8 karakter")
    .required("Password wajib diisi"),
});

export default function SuperAdminLoginForm() {
  const login = useEmployeeLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Head>
        <title>Masuk • Employee</title>
      </Head>

      <div className="relative min-h-screen bg-background md:flex md:items-center md:justify-center md:p-6">
        {/* Background effect */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 md:opacity-70"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 400px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        {/* Wrapper */}
        <div className="mx-auto w-full max-w-sm px-4 py-6 md:max-w-md md:px-6 md:py-8">
          {/* Logo / Title */}
          <div className="mb-4 flex items-center justify-center md:mb-6">
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                Employee Portal
              </span>
            </div>
          </div>

          {/* Card */}
          <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)] md:rounded-3xl md:shadow-xl">
            <CardHeader className="pb-2 text-center md:pb-3">
              <CardTitle className="text-lg font-semibold text-foreground md:text-xl">
                Employee Login
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground md:text-[0.95rem]">
                Log in to the employee dashboard
              </p>
            </CardHeader>

            <CardContent className="pt-2 md:pt-3 md:px-6">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={SuperAdminLoginSchema}
                onSubmit={(values) => {
                  login.mutate(values);
                }}
              >
                {() => (
                  <Form className="space-y-4 md:space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <Field
                        as={Input}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Input Email"
                        disabled={login.isPending}
                        className="h-12 rounded-xl md:text-base"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-xs text-destructive md:text-sm"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Input Password"
                          disabled={login.isPending}
                          className="h-12 pr-11 rounded-xl md:text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          disabled={login.isPending}
                          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                          aria-label={
                            showPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                          ) : (
                            <Eye className="h-4 w-4 md:h-5 md:w-5" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="text-xs text-destructive md:text-sm"
                      />
                    </div>

                    {/* Button */}
                    <Button
                      type="submit"
                      disabled={login.isPending}
                      className="h-12 w-full rounded-xl active:scale-[.99] disabled:opacity-70 md:text-base"
                    >
                      {login.isPending ? (
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle className="h-4 w-4 animate-spin md:h-5 md:w-5" />
                          <span>Login...</span>
                        </span>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

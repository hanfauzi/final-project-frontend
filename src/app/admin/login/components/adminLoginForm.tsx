"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSuperAdminLogin } from "../hooks/useAuthAdmin";
import Loading from "@/components/Loading";

const SuperAdminLoginSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string().min(8, "Minimal 8 karakter").required("Password wajib diisi"),
});

export default function SuperAdminLoginForm() {
  const login = useSuperAdminLogin();

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Super Admin Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SuperAdminLoginSchema}
          onSubmit={(values) => {
            login.mutate(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={login.isPending}
                className="w-full"
              >
                {login.isPending ? <Loading /> : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

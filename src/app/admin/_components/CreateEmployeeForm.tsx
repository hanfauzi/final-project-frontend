"use client";

import { FC } from "react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EmployeeFormValues,
  employeeSchema,
} from "../schema/create-employee.schema";
import { EmployeeRole } from "@/types/roles";
import Loading from "@/components/Loading";
import { useOutlets } from "../_hooks/useOutlets";
import { useShifts } from "../_hooks/useShifts";

interface EmployeeFormProps {
  initialValues: EmployeeFormValues;
  onSubmit: (values: EmployeeFormValues) => void;
  isSubmitting?: boolean;
}

const roles: EmployeeRole[] = [
  "SUPER_ADMIN",
  "OUTLET_ADMIN",
  "DRIVER",
  "WORKER",
];

const CreateEmployeeForm: FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  const { data: outlets = [], isLoading: loadingOutlets } = useOutlets();
  const { data: shifts = [], isLoading: loadingShifts } = useShifts();
    if (loadingOutlets) return <Loading />

  return (
    <div className="max-w-lg sm:max-w-xl md:max-w-4xl mx-auto p-4 sm:p-6">
    <Formik
      initialValues={initialValues}
      validationSchema={employeeSchema}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form className="flex flex-col gap-4 w-full">
          <div>
            <Input
              name="name"
              className="w-full"
              placeholder="Full Name"
              value={values.name}
              onChange={handleChange}
            />
            <ErrorMessage
              name="name"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <Input
              name="email"
              className="w-full"
              placeholder="Email"
              type="email"
              value={values.email}
              onChange={handleChange}
            />
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <Input
              name="password"
              className="w-full"
              placeholder="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
            />
            <ErrorMessage
              name="password"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <Input
              name="phoneNumber"
              className="w-full"
              placeholder="Phone Number"
              value={values.phoneNumber}
              onChange={handleChange}
            />
            <ErrorMessage
              name="phoneNumber"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <Textarea
              name="address"
              className="w-full"
              placeholder="Address"
              value={values.address}
              onChange={handleChange}
            />
            <ErrorMessage
              name="address"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <Select
              value={values.role}
              onValueChange={(val) =>
                setFieldValue("role", val as EmployeeRole)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage
              name="role"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <Field name="outletId">
            {({ field, form }: FieldProps) => (
              <div>
                <Select
                  value={field.value}
                  onValueChange={(val) => form.setFieldValue(field.name, val)}
                  disabled={values.role === "SUPER_ADMIN" || loadingOutlets}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        values.role === "SUPER_ADMIN"
                          ? "Outlet tidak diperlukan"
                          : "Pilih Outlet"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {values.role !== "SUPER_ADMIN" &&
                      outlets.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name={field.name}
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            )}
          </Field>

          <div>
            <Select
              value={values.shiftId}
              onValueChange={(val) => setFieldValue("shiftId", val)}
              disabled={loadingShifts}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage
              name="shiftId"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <Input
              name="photoUrl"
              type="file"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                setFieldValue("photoUrl", file);
              }}
            />
            <ErrorMessage
              name="photoUrl"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <Button type="submit" className="disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? <Loading /> : "Create Employee"}
          </Button>
        </Form>
      )}
    </Formik>
    </div>
  );
};

export default CreateEmployeeForm;

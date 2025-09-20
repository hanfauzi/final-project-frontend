"use client";

import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  UpdateEmployeeFormValues,
  updateEmployeeValidationSchema,
} from "../schema/update-employee.schema";
import { Shift, useShifts } from "../_hooks/useShifts";
import { EMPLOYEE_ROLES } from "@/types/roles";
import Loading from "@/components/Loading";

interface UpdateEmployeeFormProps {
  initialValues: UpdateEmployeeFormValues;
  onSubmit: (values: UpdateEmployeeFormValues) => void;
  shifts: Shift[];
  onCancel: () => void;
  isPending?: boolean
}

const roles = EMPLOYEE_ROLES;

export const UpdateEmployeeForm: FC<UpdateEmployeeFormProps> = ({
  initialValues,
  onSubmit,
  shifts,
  onCancel,
  isPending = false,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={updateEmployeeValidationSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <Field as={Input} name="name" placeholder="Name" />
            <ErrorMessage
              name="name"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <Field as={Input} name="email" placeholder="Email" />
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <Field as={Input} name="phoneNumber" placeholder="Phone Number" />
            <ErrorMessage
              name="phoneNumber"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Address</label>
            <Field as={Input} name="address" placeholder="Address" />
            <ErrorMessage
              name="address"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Role</label>
            <Select
              value={values.role}
              defaultValue={initialValues.role}
              onValueChange={(val) => setFieldValue("role", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Shift</label>
            <Select
              value={values.shiftId}
              defaultValue={initialValues.shiftId}
              onValueChange={(val) => setFieldValue("shiftId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo */}
          <div>
            <label className="block font-semibold mb-1">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFieldValue("photoUrl", e.target.files[0]);
                }
              }}
            />
            {typeof values.photoUrl === "string" && (
              <img
                src={values.photoUrl}
                alt="Preview"
                className="w-24 h-24 rounded-full mt-2 object-cover"
              />
            )}
            {values.photoUrl instanceof File && (
              <p className="text-sm mt-1">
                File selected: {values.photoUrl.name}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <Field
              as={Input}
              type="password"
              name="password"
              placeholder="Password"
            />
            <ErrorMessage
              name="password"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" className="cursor-pointer" variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
            {/* AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="cursor-pointer" disabled={isPending}>
                  {isPending?  <Loading /> : "Save"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure all the information is correct? This will
                    update the employee.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel className="cursor-pointer" disabled={isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="cursor-pointer disabled:cursor-not-allowed" onClick={() => onSubmit(values)} disabled={isPending}>
                    {isPending? <Loading /> : "Confirm"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Form>
      )}
    </Formik>
  );
};

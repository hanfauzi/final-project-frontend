"use client";

import {
  useDeleteEmployee,
  useEmployee,
  useUpdateEmployee,
} from "@/app/admin/_hooks/useEmployees";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC, useState } from "react";
import { useShifts } from "../_hooks/useShifts";
import { UpdateEmployeeFormValues } from "../schema/update-employee.schema";
import { UpdateEmployeeForm } from "./UpdateEmployeeForm";

interface EmployeeDetailProps {
  id: string;
}

const EmployeeDetail: FC<EmployeeDetailProps> = ({ id }) => {
  const { data: employee, isLoading, error } = useEmployee(id);
  const [isEditing, setIsEditing] = useState(false);
  const updateMutation = useUpdateEmployee();
  const { data: shifts, isLoading: shiftIsLoading } = useShifts();
  const deleteMutation = useDeleteEmployee();

  if (isLoading) return <Loading />;
  if (error || !employee) return <p>Employee not found</p>;

  const initialValues: UpdateEmployeeFormValues = {
    name: employee.name,
    email: employee.email,
    phoneNumber: employee.phoneNumber,
    address: employee.address,
    role: employee.role,
    shiftId: employee.shiftId,
    photoUrl: employee.photoUrl,
    password: "",
  };

  const preparePayload = (
    values: UpdateEmployeeFormValues
  ): FormData | Record<string, any> => {
    const hasFile = values.photoUrl instanceof File;

    if (hasFile) {
      const formData = new FormData();
      if (values.photoUrl instanceof File)
        formData.append("photo", values.photoUrl);
      if (values.name) formData.append("name", values.name);
      if (values.email) formData.append("email", values.email);
      if (values.phoneNumber)
        formData.append("phoneNumber", values.phoneNumber);
      if (values.address) formData.append("address", values.address);
      if (values.role) formData.append("role", values.role);
      if (values.shiftId) formData.append("shiftId", values.shiftId);
      if (values.password) formData.append("password", values.password);
      if (typeof (values as any).isActive !== "undefined")
        formData.append("isActive", String((values as any).isActive));

      return formData;
    } else {
      const payload: Record<string, any> = {};
      if (values.name) payload.name = values.name;
      if (values.email) payload.email = values.email;
      if (values.phoneNumber) payload.phoneNumber = values.phoneNumber;
      if (values.address) payload.address = values.address;
      if (values.role) payload.role = values.role;
      if (values.shiftId) payload.shiftId = values.shiftId;
      if (values.password) payload.password = values.password;
      if (typeof (values as any).isActive !== "undefined")
        payload.isActive = (values as any).isActive;
      if (typeof values.photoUrl === "string" && values.photoUrl)
        payload.photoUrl = values.photoUrl;

      return payload;
    }
  };

  const handleSubmit = (values: UpdateEmployeeFormValues) => {
    const data = preparePayload(values);

    updateMutation.mutate(
      { id: employee.id, data },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{employee.name}</CardTitle>
        <CardDescription>{employee.role}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        {isEditing ? (
          <UpdateEmployeeForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            shifts={shifts ?? []}
            onCancel={() => setIsEditing(false)}
            isPending={updateMutation.isPending}
          />
        ) : (
          <>
            {employee.photoUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={employee.photoUrl}
                  alt={employee.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="font-semibold">Email:</span>
              <span className="col-span-2">{employee.email}</span>

              <span className="font-semibold">Phone:</span>
              <span className="col-span-2">{employee.phoneNumber}</span>

              <span className="font-semibold">Address:</span>
              <span className="col-span-2">{employee.address}</span>

              <span className="font-semibold">Outlet:</span>
              <span className="col-span-2">{employee.outlet?.name || "-"}</span>
            </div>

            <div className="flex justify-between gap-2 mt-4">
              
              <ConfirmDeleteDialog
                itemName="Employee"
                onConfirm={() => deleteMutation.mutate(employee.id)}
                isPending={deleteMutation.isPending}
              />
              <Button className="cursor-pointer" onClick={() => setIsEditing(true)}>Edit</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeDetail;

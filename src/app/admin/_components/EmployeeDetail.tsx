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
import Image from "next/image";

interface EmployeeDetailProps {
  id: string;
}

export const EmployeeRoles = ["SUPER_ADMIN", "OUTLET_ADMIN", "DRIVER", "WORKER"] as const;
export type EmployeeRole = typeof EmployeeRoles[number];

interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  role?: EmployeeRole;
  shiftId?: string;
  password?: string;
  isActive?: boolean;
  photoUrl?: File;
}

const EmployeeDetail: FC<EmployeeDetailProps> = ({ id }) => {
  const { data: employee, isLoading, error } = useEmployee(id);
  const [isEditing, setIsEditing] = useState(false);
  const updateMutation = useUpdateEmployee();
  const { data: shifts } = useShifts();
  const deleteMutation = useDeleteEmployee();

  if (isLoading) return <Loading />;
  if (error || !employee) return <p>Employee not found</p>;

  const initialValues: UpdateEmployeeFormValues = {
    name: employee.name,
    email: employee.email,
    phoneNumber: employee.phoneNumber,
    address: employee.address,
    role: employee.role as EmployeeRole,
    shiftId: employee.shiftId,
    photoUrl: "",
    password: "",
  };

  const preparePayload = (
    values: UpdateEmployeeFormValues
  ): FormData | UpdateEmployeePayload => {
    if (values.photoUrl instanceof File) {
      const formData = new FormData();
      formData.append("photo", values.photoUrl);
      if (values.name) formData.append("name", values.name);
      if (values.email) formData.append("email", values.email);
      if (values.phoneNumber) formData.append("phoneNumber", values.phoneNumber);
      if (values.address) formData.append("address", values.address);
      if (values.role && EmployeeRoles.includes(values.role as EmployeeRole))
        formData.append("role", values.role);
      if (values.shiftId) formData.append("shiftId", values.shiftId);
      if (values.password) formData.append("password", values.password);
      return formData;
    } else {
      const payload: UpdateEmployeePayload = {};
      if (values.name) payload.name = values.name;
      if (values.email) payload.email = values.email;
      if (values.phoneNumber) payload.phoneNumber = values.phoneNumber;
      if (values.address) payload.address = values.address;
      if (values.role && EmployeeRoles.includes(values.role as EmployeeRole))
        payload.role = values.role as EmployeeRole;
      if (values.shiftId) payload.shiftId = values.shiftId;
      if (values.password) payload.password = values.password;
      return payload;
    }
  };

  const handleSubmit = (values: UpdateEmployeeFormValues) => {
    const data = preparePayload(values);

    updateMutation.mutate(
      { id: employee.id, data },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const avatarSrc = employee.photoUrl || "/profile-default.jpg"; 

  return (
    <Card className="w-full p-6 shadow-md">
      <CardHeader>
        <CardTitle className="sr-only">{employee.name}</CardTitle>
        <CardDescription className="sr-only items-center">{employee.role}</CardDescription>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <UpdateEmployeeForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            shifts={shifts ?? []}
            onCancel={() => setIsEditing(false)}
            isPending={updateMutation.isPending}
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Kiri: Foto + Nama */}
            <div className="flex flex-col items-center">
              <Image
                src={avatarSrc}
                alt={employee.name}
                width={160}
                height={160}
                className="rounded-full object-cover mb-4 shadow"
              />
              <h2 className="text-xl md:text-2xl font-bold text-center">{employee.name}</h2>
            </div>

            {/* Kanan: Informasi detail */}
            <div className="flex-1 grid grid-cols-1 gap-4 text-base">
              <div>
                <p className="font-semibold text-gray-600 text-sm uppercase">Role</p>
                <p className="mt-1">{employee.role}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm uppercase">Email</p>
                <p className="mt-1">{employee.email}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm uppercase">Phone</p>
                <p className="mt-1">{employee.phoneNumber}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm uppercase">Address</p>
                <p className="mt-1">{employee.address}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm uppercase">Outlet</p>
                <p className="mt-1">{employee.outlet?.name || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <ConfirmDeleteDialog
              itemName="Employee"
              onConfirm={() => deleteMutation.mutate(employee.id)}
              isPending={deleteMutation.isPending}
            />
            <Button size="default" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeDetail;

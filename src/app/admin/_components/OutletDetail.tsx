"use client";

import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import {
  useOutlet,
  useDeleteOutlet,
  useUpdateOutlet,
} from "@/app/admin/_hooks/useOutlets";
import { UpdateOutletFormValues } from "../schema/update-outlet.schema";
import { UpdateOutletForm } from "./UpdateOutletForm";
import AssignedEmployeesTable from "./AssignedEmployeesTable";
import AssignEmployeeForm from "./AssignEmployeeForm";

interface OutletDetailProps {
  id: string;
}

const OutletDetail: FC<OutletDetailProps> = ({ id }) => {
  const { data: outlet, isLoading, error } = useOutlet(id);
  const updateMutation = useUpdateOutlet();
  const deleteMutation = useDeleteOutlet();
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  if (isLoading) return <Loading />;
  if (error || !outlet) return <p>Outlet not found</p>;

  const initialValues: UpdateOutletFormValues = {
    name: outlet.name,
    address: outlet.address as string,
    phoneNumber: outlet.phoneNumber as string,
    cityId: outlet.cityId,
    postalCode: outlet.postalCode,
    latitude: outlet.latitude as number,
    longitude: outlet.longitude as number,
    coverageArea: outlet.coverageArea as number,
    isActive: outlet.isActive,
  };

  const handleSubmit = (values: UpdateOutletFormValues) => {
    updateMutation.mutate(
      { id: outlet.id, data: values },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-md mx-auto mt-6 w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{outlet.name}</CardTitle>
          <CardDescription>{outlet.address}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          {isEditing ? (
            <UpdateOutletForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
              isPending={updateMutation.isPending}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="font-semibold">Phone</span>
                <span>{outlet.phoneNumber}</span>

                <span className="font-semibold">City</span>
                <span>{outlet.cityName}</span>

                <span className="font-semibold">Status</span>
                <span>{outlet.isActive ? "Active" : "Inactive"}</span>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <ConfirmDeleteDialog
                  itemName="Outlet"
                  onConfirm={() => deleteMutation.mutate(outlet.id)}
                  isPending={deleteMutation.isPending}
                />

                <Button
                  className="cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button
        className="mt-4 cursor-pointer"
        onClick={() => setShowAssignForm((prev) => !prev)}
      >
        {showAssignForm ? "Cancel" : "Assign Employee to this Outlet"}
      </Button>

      {showAssignForm && <AssignEmployeeForm outletId={id} />}
      <AssignedEmployeesTable outletId={id} />
    </div>
  );
};

export default OutletDetail;

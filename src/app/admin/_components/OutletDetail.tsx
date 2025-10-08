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
  if (error || !outlet) return <p className="text-red-500 text-center mt-4">Outlet not found</p>;

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
    <div className="p-6 space-y-6">
      <Card className="max-w-5xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Outlet Detail</CardTitle>
          <CardDescription>{outlet.name}</CardDescription>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <UpdateOutletForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
              isPending={updateMutation.isPending}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Outlet Name
                  </p>
                  <p className="font-semibold">{outlet.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="font-semibold">{outlet.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p className="font-semibold">{outlet.cityName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Postal Code
                  </p>
                  <p className="font-semibold">{outlet.postalCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Coverage Area (km)
                  </p>
                  <p className="font-semibold">{outlet.coverageArea}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p
                    className={`font-semibold ${
                      outlet.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {outlet.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="font-semibold">{outlet.address}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <ConfirmDeleteDialog
                  itemName="Outlet"
                  onConfirm={() => deleteMutation.mutate(outlet.id)}
                  isPending={deleteMutation.isPending}
                />
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="max-w-5xl mx-auto w-full">
        <Button
          className="mt-4 cursor-pointer"
          onClick={() => setShowAssignForm((prev) => !prev)}
        >
          {showAssignForm ? "Cancel" : "Assign Employee to this Outlet"}
        </Button>

        {showAssignForm && (
          <div className="mt-4">
            <AssignEmployeeForm outletId={id} />
          </div>
        )}

        <div className="mt-6">
          <AssignedEmployeesTable outletId={id} />
        </div>
      </div>
    </div>
  );
};

export default OutletDetail;

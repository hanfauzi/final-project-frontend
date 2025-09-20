"use client";

import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { useOutlet, useDeleteOutlet, useUpdateOutlet } from "@/app/admin/_hooks/useOutlets"; 
import { UpdateOutletFormValues } from "../schema/update-outlet.schema";
import { UpdateOutletForm } from "./UpdateOutletForm";

interface OutletDetailProps {
  id: string;
}

const OutletDetail: FC<OutletDetailProps> = ({ id }) => {
  const { data: outlet, isLoading, error } = useOutlet(id);
  const updateMutation = useUpdateOutlet();
  const deleteMutation = useDeleteOutlet();
  const [isEditing, setIsEditing] = useState(false);

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
    <Card className="max-w-md mx-auto mt-6">
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
            <p>
              <span className="font-semibold">Phone:</span> {outlet.phoneNumber}
            </p>
             <p>
              <span className="font-semibold">City:</span> {outlet.cityName}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {outlet.isActive ? "Active" : "Inactive"}
            </p>

            <Button
              className="mt-4 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>

            <ConfirmDeleteDialog
              itemName="Outlet"
              onConfirm={() => deleteMutation.mutate(outlet.id)}
              isPending={deleteMutation.isPending}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OutletDetail;

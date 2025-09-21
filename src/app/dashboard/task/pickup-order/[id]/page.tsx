"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import useGetPickUpOrderById from "../../_hooks/useGetPickUpOrderById";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import useUpdatePickUpOrder from "../../_hooks/useProcessPickUpOrder";
import PickUpOrderDetailCard from "./_components/PickUpOrderDetailCard";
import PickUpTimelineCard from "./_components/PickUpTimlineCard";

export default function PickUpOrderDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: pickUpOrder,
    isLoading,
    isError,
    error,
  } = useGetPickUpOrderById(id);

  const {
    mutate: updatePickUpOrder,
    isPending: isUpdating,
  } = useUpdatePickUpOrder();

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (isError) {
    let errorMessage = "Something went wrong";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else {
      errorMessage = (error as Error).message;
    }
    return <div className="text-destructive">Error: {errorMessage}</div>;
  }
  if (!pickUpOrder) return <div>No order found</div>;

  return (
    <div className="flex flex-col gap-4 pb-14">
      <PickUpOrderDetailCard pickUpOrder={pickUpOrder} />
      <PickUpTimelineCard pickUpOrder={pickUpOrder} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="shadow-lg hover:cursor-pointer"
            disabled={isUpdating || pickUpOrder.status === "RECEIVED_BY_OUTLET"}
          >
            {isUpdating
              ? "Loading..."
              : pickUpOrder.status === "RECEIVED_BY_OUTLET"
              ? "This pickup order is already completed ✅"
              : "Process this pickup order"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure want to proceed?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updatePickUpOrder(id)}
              disabled={isUpdating}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

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
import PickUpOrderDetailCard from "./_components/PickUpOrderDetailCard";
import PickUpTimelineCard from "./_components/PickUpTimlineCard";
import useProcessPickUpOrder from "../../_hooks/useProcessPickUpOrder";

export default function PickUpOrderDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: pickUpOrder,
    isLoading,
    isError,
    error,
  } = useGetPickUpOrderById(id);

  const {
    mutate: processPickUpOrder,
    isPending: isUpdating,
  } = useProcessPickUpOrder();

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

  const buttonLabel = (status: string, isUpdating: boolean) => {
    if (isUpdating) return (
      <>
        <div className="loading loading-spinner loading-xs" />
        Processing...
      </>
    );

    switch (status) {
      case "ON_THE_WAY_TO_CUSTOMER":
        return "Confirm pickup from customer";
      case "ON_THE_WAY_TO_OUTLET":
        return "Complete this pickup order";
      case "RECEIVED_BY_OUTLET":
        return "This pickup order is already completed ✅";
      default:
        return "Process this pickup order";
    }
  };

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
            {buttonLabel(pickUpOrder.status, isUpdating)}
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
              onClick={() => processPickUpOrder(id)}
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

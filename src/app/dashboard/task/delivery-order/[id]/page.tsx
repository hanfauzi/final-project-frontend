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
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import useGetDeliveryOrderById from "../../_hooks/useGetDeliveryOrderById";
import useProcessDeliveryOrder from "../../_hooks/useProcessDeliveryOrder";
import DeliveryOrderDetailCard from "./_components/DeliveryOrderDetailCard";
import DeliveryTimelineCard from "./_components/DeliveryTimlineCard";

export default function DeliveryOrderDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: deliveryOrder,
    isLoading,
    isError,
    error,
  } = useGetDeliveryOrderById(id);

  const {
    mutate: processDeliveryOrder,
    isPending: isUpdating,
  } = useProcessDeliveryOrder();

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
  if (!deliveryOrder) return <div>No order found</div>;

  const buttonLabel = (status: string, isUpdating: boolean) => {
    if (isUpdating) return (
      <>
        <div className="loading loading-spinner loading-xs" />
        Processing...
      </>
    );

    switch (status) {
      case "ON_THE_WAY_TO_OUTLET":
        return "Confirm pickup from outlet";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "Mark as delivered";
      case "RECEIVED_BY_CUSTOMER":
        return "This delivery order is already completed ✅";
      default:
        return "Process this pickup order";
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-14">
      <DeliveryOrderDetailCard deliveryOrder={deliveryOrder} />
      <DeliveryTimelineCard deliveryOrder={deliveryOrder} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="shadow-lg hover:cursor-pointer"
            disabled={isUpdating || deliveryOrder.status === "RECEIVED_BY_CUSTOMER"}
          >
            {buttonLabel(deliveryOrder.status, isUpdating)}
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
              onClick={() => processDeliveryOrder(id)}
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

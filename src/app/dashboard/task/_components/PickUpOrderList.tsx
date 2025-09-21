"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";
import useGetPickUpOrdersByDriver from "../_hooks/useGetPickUpOrdersByDriver";

export default function PickUpOrdersList() {
  const { 
    data: pickUpOrders = [], 
    isLoading: pickUpOrderLoading, 
    isError: isPickUpOrdersError,
    error: pickUpOrdersError, 
  } = useGetPickUpOrdersByDriver();

  if (pickUpOrderLoading) return (
  <div className="flex flex-col gap-3 p-3 rounded-md bg-card border border-primary shadow-md shadow-primary/20 hover:bg-gray-100">
    <div className="flex justify-between">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-5 w-12" />
    </div>
    <div className="flex justify-between items-center gap-2">
      <Skeleton className="flex-5/12 h-6 w-full" />
      <Skeleton className="flex-7/12 h-6 w-full" />
    </div>
  </div>
  );
  if (isPickUpOrdersError) return <div className="text-red-500">Error: {pickUpOrdersError.message}</div>;
  if (pickUpOrders.length === 0) return <div>No pick-up order available</div>;

  return (
    <div className="flex flex-col gap-3">
      {pickUpOrders.map((pickUpOrder) => (
        <Link key={pickUpOrder.id} 
          href={`/dashboard/task/pickup-order/${pickUpOrder.id}`} 
          className="flex flex-col gap-3 p-3 rounded-md bg-card border border-primary shadow-md shadow-primary/20 hover:bg-gray-100"
        >
          <div className="flex justify-between gap-2">
            <small>
              {pickUpOrder.createdAt
                ? format(new Date(pickUpOrder.createdAt), "EEE, dd MMMM yyyy")
                : "N/A"}
            </small>
            <small>
              {pickUpOrder.createdAt
                ? format(new Date(pickUpOrder.createdAt), "hh:mm")
                : "N/A"}
            </small>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p className="flex-5/12 truncate">{pickUpOrder?.id}</p>
            <small className="flex-7/12 text-right">{pickUpOrder?.status}</small>
          </div>
        </Link>
      ))}
    </div>
  );
}
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";

type Order = {
  id: string;
  createdAt?: string | Date | null;
  status?: string;
};

type OrdersListProps = {
  orders: Order[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  basePath: string;
  emptyMessage?: string;
};

export default function OrdersList({
  orders = [],
  isLoading,
  isError,
  error,
  basePath,
  emptyMessage = "No order available",
}: OrdersListProps) {
  if (isLoading)
    return (
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

  if (isError) return <div className="text-red-500">Error: {error?.message}</div>;

  if (!orders || orders.length === 0) return <div>{emptyMessage}</div>;

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`${basePath}${order.id}`}
          className="flex flex-col gap-3 p-3 rounded-md bg-card border border-primary shadow-md shadow-primary/20 hover:bg-gray-100"
        >
          <div className="flex justify-between gap-2">
            <small>
              {order.createdAt
                ? format(new Date(order.createdAt), "EEE, dd MMMM yyyy")
                : "N/A"}
            </small>
            <small>
              {order.createdAt
                ? format(new Date(order.createdAt), "HH:mm")
                : "N/A"}
            </small>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p className="flex-5/12 truncate">{order.id}</p>
            <small className="flex-7/12 text-right">{order.status}</small>
          </div>
        </Link>
      ))}
    </div>
  );
}

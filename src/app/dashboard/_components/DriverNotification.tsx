"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import useGetPickUpOrdersByDriver from "../task/_hooks/useGetPickUpOrdersByDriver";
import { PickUpOrder } from "@/types/pickUpOrder";
import { formatDistanceToNow } from "date-fns";
import useGetDeliveryOrdersByDriver from "../task/_hooks/useGetDeliveryOrdersByDriver";
import { DeliveryOrder } from "@/types/deliveryOrder";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DriverNotification() {
  const {
    data: pickUpOrders,
    isLoading: pickUpOrdersLoading,
    error: pickUpOrdersError,
  } = useGetPickUpOrdersByDriver({
    query: { mode: "AVAILABLE_TASK" },
    activeInterval: 30000,
    inactiveInterval: 300000,
  });

  const {
    data: deliveryOrders,
    isLoading: deliveryOrdersLoading,
    error: deliveryOrdersError,
  } = useGetDeliveryOrdersByDriver({
    query: { mode: "AVAILABLE_TASK" },
    activeInterval: 30000,
    inactiveInterval: 300000,
  });

  const allNotifications = useMemo(() => {
    const pickups = Array.isArray(pickUpOrders?.data)
    ? pickUpOrders!.data.map((o: PickUpOrder) => ({
        id: o.id,
        type: "PICKUP" as const,
        createdAt: o.createdAt,
        address: o.customerAddress?.address,
      }))
    : [];

    const deliveries = Array.isArray(deliveryOrders?.data)
    ? deliveryOrders!.data.map((o: DeliveryOrder) => ({
        id: o.id,
        type: "DELIVERY" as const,
        createdAt: o.createdAt,
        address: o.customerAddress?.address,
      }))
    : [];

    return [...pickups, ...deliveries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [pickUpOrders, deliveryOrders]);

  const isLoading = pickUpOrdersLoading || deliveryOrdersLoading;
  const hasError = pickUpOrdersError || deliveryOrdersError;
  const notificationCount = allNotifications.length;

  if (isLoading || hasError) return null;

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <Button
        tabIndex={0}
        role="button"
        variant="ghost"
        size="icon"
        className="rounded-full m-1"
        aria-label="Driver Notifications"
      >
        <div className="indicator">
          <Bell className="size-5" />
          {notificationCount > 0 && (
            <span className="badge badge-xs bg-destructive indicator-item px-1">
              {notificationCount}
            </span>
          )}
        </div>
      </Button>

      <div
        tabIndex={0}
        className="dropdown-content menu bg-card flex flex-col rounded-box z-10 p-1 w-xs shadow-md"
      >
        {notificationCount === 0 ? (
          <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            No new tasks available
          </div>
        ) : (
          <>
            <div className="px-4 py-2 text-muted-foreground font-semibold text-sm">
              Recent task need to be processed
            </div>
            <div className="relative flex w-full items-center px-2 py-1">
              <div className="flex-grow border-t-2 border-muted" />
            </div>

            <ScrollArea className="max-h-md overflow-y-auto p-0 m-0">
              {allNotifications.map((task) => (
                <Link
                  key={`${task.type}-${task.id}`}
                  href={
                    task.type === "PICKUP"
                      ? `/dashboard/task/pickup-order/${task.id}`
                      : `/dashboard/task/delivery-order/${task.id}`
                  }
                  className="flex flex-col gap-1 max-w-[300px] rounded-md hover:bg-primary/30 px-4 py-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-7/12 font-medium truncate">
                      <span className="font-bold">{task.type === "PICKUP" ? "Pickup" : "Delivery"}</span> #{task.id}
                    </div>
                    <div className="flex-5/12 text-right text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {task.address}
                  </div>
                </Link>
              ))}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}

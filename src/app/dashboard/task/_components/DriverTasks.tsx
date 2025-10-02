"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetDeliveryOrderById from "../_hooks/useGetDeliveryOrderById";
import useGetDeliveryOrdersByDriver from "../_hooks/useGetDeliveryOrdersByDriver";
import useGetPickUpTaskById from "../_hooks/useGetPickUpOrderById";
import useGetPickUpOrdersByDriver from "../_hooks/useGetPickUpOrdersByDriver";
import CurrentActiveTaskCard from "./CurrentActiveTaskCard";
import OrdersList from "./OrderList";
import Link from "next/link";
import { ClipboardClock } from "lucide-react";
import { useEmployee } from "../../_context/EmployeeContext";
import { useState } from "react";
import PaginationSection from "@/components/PaginationSection";

export default function DriverTasks() {
  const { employee, } = useEmployee();

  const [pickUpOrderPage, setPickUpOrderPage] = useState(1);
  const [deliveryOrderPage, setDeliveryOrderPage] = useState(1);

  const {
    data: pickUpOrder,
    isLoading: pickUpOrderLoading,
  } = useGetPickUpTaskById(employee?.takenTaskId ?? "", {
    enabled: !!employee?.takenTaskId && employee?.takenTaskType === "PICKUP",
  });

  const {
    data: deliveryOrder,
    isLoading: deliveryOrderLoading,
  } = useGetDeliveryOrderById(employee?.takenTaskId ?? "", {
    enabled: !!employee?.takenTaskId && employee?.takenTaskType === "DELIVERY",
  });

  const {
    data: pickUpOrders,
    isLoading: pickUpOrdersLoading,
    isError: pickUpOrdersError,
    error: pickUpOrdersErrorObj,
  } = useGetPickUpOrdersByDriver({
    query: { mode: "AVAILABLE_TASK", page: pickUpOrderPage, take: 5 },
    activeInterval: false,
    inactiveInterval: false,
  });

  const {
    data: deliveryOrders,
    isLoading: deliveryOrdersLoading,
    isError: deliveryOrdersError,
    error: deliveryOrdersErrorObj,
  } = useGetDeliveryOrdersByDriver({
    query: { mode: "AVAILABLE_TASK", page: deliveryOrderPage, take: 5 },
    activeInterval: false,
    inactiveInterval: false,
  });

  let taskUrl: string | null = null;

  if (employee?.takenTaskId) {
    switch(employee.takenTaskType) {
      case "PICKUP":
        taskUrl= `/dashboard/task/pickup-order/${employee?.takenTaskId}`
        break;
      case "DELIVERY":
        taskUrl= `/dashboard/task/delivery-order/${employee?.takenTaskId}`
        break;
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-14">
      <div>
        <h1>Hello, <span className="font-bold">{employee?.name ?? "User"}</span></h1>
        <h2>This is your driver task list</h2>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Currently Active Tasks</h2>
        {employee?.takenTaskId && taskUrl ? (
          employee.takenTaskType === "PICKUP" ? (
            <CurrentActiveTaskCard
              href={taskUrl}
              loading={pickUpOrderLoading}
              createdAt={pickUpOrder?.createdAt}
              id={pickUpOrder?.id}
              status={pickUpOrder?.status}
            />
          ) : (
            <CurrentActiveTaskCard
              href={taskUrl}
              loading={deliveryOrderLoading}
              createdAt={deliveryOrder?.createdAt}
              id={deliveryOrder?.id}
              status={deliveryOrder?.status}
            />
          )
        ) : (
          <div className="text-center p-3 rounded-md border mb-2 bg-card">
            You are currently not taking any task
          </div>
        )}
      </div>
      <Tabs defaultValue="pickup">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">Available Task</div>
            <div className="flex items-center gap-2">
              <Link href={"/dashboard/task/history"} className="p-2">
                <ClipboardClock className="size-5"/>
              </Link>
              <TabsList className="bg-foreground/5">
                <TabsTrigger value="pickup"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Pickup
                </TabsTrigger>
                <TabsTrigger value="delivery"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Delivery
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        <TabsContent value="pickup">
          <OrdersList
            orders={pickUpOrders?.data ?? []}
            isLoading={pickUpOrdersLoading}
            isError={pickUpOrdersError}
            error={pickUpOrdersErrorObj as Error | null}
            basePath="/dashboard/task/pickup-order/"
            emptyMessage="No pick-up order available"
          />
          {pickUpOrders?.meta && (
            <div className="flex justify-center">
              <div className="py-2">
                <PaginationSection meta={pickUpOrders.meta} setPage={setPickUpOrderPage} />
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="delivery">
          <OrdersList
            orders={deliveryOrders?.data ?? []}
            isLoading={deliveryOrdersLoading}
            isError={deliveryOrdersError}
            error={deliveryOrdersErrorObj as Error | null}
            basePath="/dashboard/task/delivery-order/"
            emptyMessage="No delivery order available"
          />
          {deliveryOrders?.meta && (
            <div className="flex justify-center">
              <div className="py-2">
                <PaginationSection meta={deliveryOrders.meta} setPage={setDeliveryOrderPage} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
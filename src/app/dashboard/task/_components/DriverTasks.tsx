"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetEmployee from "../../_hooks/useGetEmployee";
import useGetDeliveryOrderById from "../_hooks/useGetDeliveryOrderById";
import useGetDeliveryOrdersByDriver from "../_hooks/useGetDeliveryOrdersByDriver";
import useGetPickUpTaskById from "../_hooks/useGetPickUpOrderById";
import useGetPickUpOrdersByDriver from "../_hooks/useGetPickUpOrdersByDriver";
import CurrentActiveTaskCard from "./CurrentActiveTaskCard";
import OrdersList from "./OrderList";

export default function DriverTasks() {
  const { data: employee, } = useGetEmployee();

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
    data: pickUpOrders = [],
    isLoading: pickUpOrdersLoading,
    isError: pickUpOrdersError,
    error: pickUpOrdersErrorObj,
  } = useGetPickUpOrdersByDriver();

  const {
    data: deliveryOrders = [],
    isLoading: deliveryOrdersLoading,
    isError: deliveryOrdersError,
    error: deliveryOrdersErrorObj,
  } = useGetDeliveryOrdersByDriver();

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
            <div className="text-lg font-bold">Task List</div>
            <TabsList>
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
        <TabsContent value="pickup">
          <OrdersList
            orders={pickUpOrders}
            isLoading={pickUpOrdersLoading}
            isError={pickUpOrdersError}
            error={pickUpOrdersErrorObj as Error | null}
            basePath="/dashboard/task/pickup-order/"
            emptyMessage="No pick-up order available"
          />
        </TabsContent>
        <TabsContent value="delivery">
          <OrdersList
            orders={deliveryOrders}
            isLoading={deliveryOrdersLoading}
            isError={deliveryOrdersError}
            error={deliveryOrdersErrorObj as Error | null}
            basePath="/dashboard/task/delivery-order/"
            emptyMessage="No delivery order available"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import Link from "next/link";
import useGetEmployee from "../../_hooks/useGetEmployee";
import useGetPickUpTaskById from "../_hooks/useGetPickUpOrderById";
import { Skeleton } from "@/components/ui/skeleton";
import PickUpOrdersList from "./PickUpOrderList";

export default function DriverTasks() {
  const { data: employee, isLoading: employeeLoading, error: employeeError } = useGetEmployee();

  let taskUrl: string | null = null;

  const {
    data: pickUpOrder,
    isLoading: pickUpOrderLoading,
    isError: isPickUpOrdersError,
    error: pickUpOrdersError,
  } = useGetPickUpTaskById(employee?.takenTaskId ?? "", {
    enabled: !!employee?.takenTaskId && employee?.takenTaskType === "PICKUP",
  });

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
          <Link href={taskUrl} className="flex flex-col gap-3 p-3 rounded-md bg-card border-2 border-primary shadow-md shadow-primary/30 hover:bg-gray-100">
            <div className="flex justify-between">
              {pickUpOrderLoading ? (
                <Skeleton className="h-5 w-36" />
              ) : (
                <small>
                  {pickUpOrder?.createdAt
                    ? format(new Date(pickUpOrder.createdAt), "EEE, dd MMMM yyyy")
                    : "N/A"}
                </small>
              )}
              {pickUpOrderLoading ? (
                <Skeleton className="h-5 w-12" />
              ) : (
                <small>
                  {pickUpOrder?.createdAt
                    ? format(new Date(pickUpOrder.createdAt), "hh:mm")
                    : "N/A"}
                </small>
              )}
            </div>
            <div className="flex justify-between items-center gap-2">
              {pickUpOrderLoading ? (
                <Skeleton className="flex-5/12 h-6 w-full" />
              ) : (
                <p className="flex-5/12 truncate">{pickUpOrder?.id}</p>
              )}
              {pickUpOrderLoading ? (
                <Skeleton className="flex-7/12 h-6 w-full" />
              ) : (
                <small className="flex-7/12 text-right">{pickUpOrder?.status}</small>
              )}
            </div>
          </Link>
        ) : (
          <div className="text-center p-3 rounded-md border mb-2 bg-card">You are currently not taking any task</div>
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
          <PickUpOrdersList />
        </TabsContent>
        <TabsContent value="delivery">
          This component not yet implemented
        </TabsContent>
      </Tabs>
    </div>
  );
}
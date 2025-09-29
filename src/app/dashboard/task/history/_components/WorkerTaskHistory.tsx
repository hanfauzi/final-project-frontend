"use client";

import useGetEmployee from "@/app/dashboard/_hooks/useGetEmployee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetWorkerTasksByWorker from "../../_hooks/useGetWorkerTasksByWorker";
import OrdersList from "../../_components/OrderList";

export default function WorkerTaskHistory() {
  const { data: employee, } = useGetEmployee();

  const {
    data: workerTasks = [],
    isLoading: workerTasksLoading,
    isError: workerTasksError,
    error: workerTasksErrorObj,
  } = useGetWorkerTasksByWorker({
    mode: "HISTORY",
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
        <h2>This is your task history</h2>
      </div>
      
      <Tabs defaultValue="pickup">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">Task History</div>
            {/* <TabsList className="bg-foreground/5">
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
            </TabsList> */}
          </div>
        <TabsContent value="pickup">
          <OrdersList
            orders={workerTasks}
            isLoading={workerTasksLoading}
            isError={workerTasksError}
            error={workerTasksErrorObj as Error | null}
            basePath="/dashboard/task/"
            emptyMessage="No task history available"
          />
        </TabsContent>
        <TabsContent value="delivery">
          {/* <OrdersList
            orders={deliveryOrders}
            isLoading={deliveryOrdersLoading}
            isError={deliveryOrdersError}
            error={deliveryOrdersErrorObj as Error | null}
            basePath="/dashboard/task/delivery-order/"
            emptyMessage="No delivery order available"
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import useGetEmployee from "@/app/dashboard/_hooks/useGetEmployee";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import OrdersList from "../../_components/OrderList";
import useGetWorkerTasksByWorker from "../../_hooks/useGetWorkerTasksByWorker";

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

  return (
    <div className="flex flex-col gap-4 pb-14">
      <div>
        <h1>Hello, <span className="font-bold">{employee?.name ?? "User"}</span></h1>
        <h2>This is your task history</h2>
      </div>
      
      <Tabs defaultValue="pickup">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">Task History</div>
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
      </Tabs>
    </div>
  );
}
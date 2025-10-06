"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import OrdersList from "../../_components/OrderList";
import useGetWorkerTasksByWorker from "../../_hooks/useGetWorkerTasksByWorker";
import { useEmployee } from "@/app/dashboard/_context/EmployeeContext";
import { useState } from "react";
import PaginationSection from "@/components/PaginationSection";
import { DateRangePicker } from "@/components/DateRangePicker";

export default function WorkerTaskHistory() {
  const { employee } = useEmployee();

  const [workerTaskPage, setWorkerTaskPage] = useState(1);
  const handleWorkerTaskDateChange = (date: { from: string; to: string }) => {
    if (date.from !== workerTaskDateRange?.from || date.to !== workerTaskDateRange?.to) {
      setWorkerTaskDateRange(date);
      setWorkerTaskPage(1);
    }
  };
  const [workerTaskDateRange, setWorkerTaskDateRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const {
    data: workerTasks,
    isLoading: workerTasksLoading,
    isError: workerTasksError,
    error: workerTasksErrorObj,
  } = useGetWorkerTasksByWorker({
    query: { 
      mode: "HISTORY", 
      page: workerTaskPage, 
      take: 10,
      fromDate: workerTaskDateRange?.from,
      toDate: workerTaskDateRange?.to,
    }
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
          <div className="flex flex-col gap-4">
            <DateRangePicker
              value={workerTaskDateRange}
              onChange={handleWorkerTaskDateChange}
            />
            <OrdersList
              orders={workerTasks?.data ?? []}
              isLoading={workerTasksLoading}
              isError={workerTasksError}
              error={workerTasksErrorObj as Error | null}
              basePath="/dashboard/task/"
              emptyMessage="No task history available"
            />
            {workerTasks?.meta && (
              <div className="flex justify-center">
                <div>
                  <PaginationSection meta={workerTasks.meta} setPage={setWorkerTaskPage} />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
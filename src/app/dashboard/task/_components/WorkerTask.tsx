"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { ClipboardClock } from "lucide-react";
import Link from "next/link";
import { useEmployee } from "../../_context/EmployeeContext";
import useGetWorkerTaskById from "../_hooks/useGetWorkerTaskById";
import useGetWorkerTasksByWorker from "../_hooks/useGetWorkerTasksByWorker";
import CurrentActiveTaskCard from "./CurrentActiveTaskCard";
import OrdersList from "./OrderList";
import { useState } from "react";
import PaginationSection from "@/components/PaginationSection";

export default function WorkerTask() {
  const { employee, } = useEmployee();

  const [workerTaskPage, setWorkerTaskPage] = useState(1);

  const {
    data: workerTask,
    isLoading: workerTaskLoading,
  } = useGetWorkerTaskById(employee?.takenTaskId ?? "", {
    enabled: !!employee?.takenTaskId,
  });

  const {
    data: workerTasks,
    isLoading: workerTasksLoading,
    isError: workerTasksError,
    error: workerTasksErrorObj,
  } = useGetWorkerTasksByWorker({
    query: { mode: "AVAILABLE_TASK", page: workerTaskPage, take: 10 }
  });

  return (
    <div className="flex flex-col gap-4 pb-14">
      <div>
        <h1>Hello, <span className="font-bold">{employee?.name ?? "User"}</span></h1>
        <h2>This is your worker task list</h2>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Currently Active Tasks</h2>
        {employee?.takenTaskId ? (
          <CurrentActiveTaskCard
              href={`/dashboard/task/${workerTask?.id}`}
              loading={workerTaskLoading}
              createdAt={workerTask?.createdAt}
              id={workerTask?.id}
              status={workerTask?.status}
            />
        ) : (
          <div className="text-center p-3 rounded-md border mb-2 bg-card">
            You are currently not taking any task
          </div>
        )}
      </div>
      <Tabs defaultValue="pickup">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">Available Task</div>
            <TabsList>
              <Link href={"/dashboard/task/history"} className="p-2">
                <ClipboardClock className="size-5"/>
              </Link>
            </TabsList>
          </div>
        <TabsContent value="pickup">
          <OrdersList
            orders={workerTasks?.data ?? []}
            isLoading={workerTasksLoading}
            isError={workerTasksError}
            error={workerTasksErrorObj as Error | null}
            basePath="/dashboard/task/"
            emptyMessage="No worker task available"
          />
          {workerTasks?.meta && (
            <div className="flex justify-center">
              <div className="py-2">
                <PaginationSection meta={workerTasks.meta} setPage={setWorkerTaskPage} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
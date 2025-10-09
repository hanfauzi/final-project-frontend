"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetWorkerTasksByWorker from "../task/_hooks/useGetWorkerTasksByWorker";
import { WorkerTask } from "@/types/workerTask";

export default function WorkerNotification() {
  const {
    data: workerTasks,
    isLoading: workerTasksLoading,
    error: workerTasksError,
  } = useGetWorkerTasksByWorker({
    query: {
      mode: "AVAILABLE_TASK",
      sortBy: "createdAt",
      sortOrder: "desc",
      take: 10,
      page: 1,
    },
    activeInterval: 15000,
    inactiveInterval: 150000,
  });

  const allNotifications = useMemo(() => {
    return Array.isArray(workerTasks?.data)
      ? workerTasks.data.map((workerTask: WorkerTask) => ({
          id: workerTask.id,
          station: workerTask.station,
          createdAt: workerTask.createdAt,
          address: workerTask.customerAddress?.address,
          items: workerTask.orderHeader?.OrderItem?.map((item) => {
            return `${item.service?.name ?? "Unknown"}: ${item.qty} ${item.service?.unit ?? ""}`;
          }).join(", "),
        }))
      : [];
  }, [workerTasks]);

  const isLoading = workerTasksLoading;
  const hasError = workerTasksError;
  const notificationCount = allNotifications.length;

  if (isLoading || hasError) return null;

  const stationLabels: Record<string, { label: string; color: string }> = {
    WASHING: { label: "Washing", color: "text-foreground" },
    IRONING: { label: "Ironing", color: "text-foreground" },
    PACKING: { label: "Packing", color: "text-foreground" },
  };

  return (
    <div className='dropdown dropdown-bottom dropdown-end'>
      <Button
        tabIndex={0}
        role='button'
        variant='ghost'
        size='icon'
        className='rounded-full m-1'
        aria-label='Worker Notifications'
      >
        <div className='indicator'>
          <Bell className='size-5' />
          {notificationCount > 0 && (
            <span className='badge badge-xs bg-destructive indicator-item px-1'>
              {notificationCount}
            </span>
          )}
        </div>
      </Button>

      <div
        tabIndex={0}
        className='dropdown-content menu bg-card flex flex-col rounded-box z-10 p-1 w-xs shadow-md'
      >
        {notificationCount === 0 ? (
          <div className='px-4 py-2 text-sm font-semibold text-muted-foreground'>
            No new tasks available
          </div>
        ) : (
          <>
            <div className='px-4 py-2 text-muted-foreground font-semibold text-sm'>
              Recent task need to be processed
            </div>
            <div className='relative flex w-full items-center px-2 py-1'>
              <div className='flex-grow border-t-2 border-muted' />
            </div>

            <ScrollArea className='max-h-md overflow-y-auto p-0 m-0'>
              {allNotifications.map((task) => {
                const station = stationLabels[task.station] ?? { label: task.station, color: "bg-gray-400" };
                return (
                  <Link
                    key={task.id}
                    href={`/dashboard/task/${task.id}`}
                    className='flex flex-col gap-1 max-w-[300px] rounded-md hover:bg-primary/30 px-4 py-2'
                  >
                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex-7/12 font-medium truncate'>
                        <span className={`font-bold ${station.color}`}>
                          {station.label}
                        </span>{" "}
                        #{task.id}
                      </div>
                      <div className='flex-5/12 text-right text-xs text-muted-foreground'>
                        {formatDistanceToNow(new Date(task.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <div className='text-[13px] text-muted-foreground line-clamp-2'>
                      {task.items}
                    </div>
                  </Link>
                );
              })}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}

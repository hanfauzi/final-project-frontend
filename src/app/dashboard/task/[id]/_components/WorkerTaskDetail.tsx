"use client";



import { isAxiosError } from "axios";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import useGetWorkerTaskById from "../../_hooks/useGetWorkerTaskById";
import useProcessWorkerTask from "../../_hooks/useProcessWorkerTask";
import ProcessWorkerTaskButton from "./ProcessWorkerTaskButton";
import WorkerReCountForm from "./WorkerReCountForm";
import RequestBypassForm from "./RequestBypassForm";

export default function WorkerTaskDetailCard() {
  const { id } = useParams<{ id: string }>();

  const [copied, setCopied] = useState(false);

  const {
    data: workerTask,
    isLoading,
    isError,
    error,
  } = useGetWorkerTaskById(id);

  const { mutate: processWorkerTask, isPending: isProcessingWorkerTask } = useProcessWorkerTask();

  if (isLoading)
    return (
      <div className='flex gap-2 items-center justify-center'>
        <div className='loading loading-spinner text-primary'></div>
        <div>Loading task data...</div>
      </div>
    );
  if (isError) {
    let errorMessage = "Something went wrong";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else {
      errorMessage = (error as Error).message;
    }
    return <div className='text-destructive'>Error: {errorMessage}</div>;
  }
  if (!workerTask) return <div>No task found</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(workerTask.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const initialValues = {
    workerTaskId: workerTask.id,
    items:
      workerTask.orderHeader?.OrderItem?.flatMap((orderItem) =>
        (orderItem.orderItemLaundry ?? []).map((laundry) => ({
          laundryItemId: laundry.laundryItem?.id ?? "",
          expectedQty: laundry.qty,
          qty: 0,
        }))
      ) || [],
  };

  const laundryNames =
    workerTask.orderHeader?.OrderItem?.flatMap((oi) =>
      oi.orderItemLaundry?.map((laundry) => laundry.laundryItem?.name ?? "")
    ) || [];

  return (
    <div className='bg-card border-1 rounded-md p-3'>
      <div className='flex flex-col items-center gap-4 text-sm'>
        <div className='flex justify-center gap-1 w-full'>
          <div className='overflow-hidden max-w-8/12'>
            <div className='text-primary text-xl font-bold whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:overflow-x-auto'>
              {workerTask.id}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className='max-w-1/12 h-fit text-gray-600 p-1 hover:text-gray-800 hover:cursor-pointer'
            title='Copy to clipboard'
          >
            {copied ? (
              <Copy size={18} className='text-blue-300' />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex justify-between'>
            <div className='flex-5/12 font-semibold'>Assigned Date</div>
            <div className='flex-7/12 text-right'>
              {workerTask.createdAt
                ? format(new Date(workerTask.createdAt), "EEE, dd MMMM yyyy")
                : "N/A"}
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex-5/12 font-semibold'>Assigned Time</div>
            <div className='flex-7/12 text-right'>
              {workerTask.createdAt
                ? format(new Date(workerTask.createdAt), "HH:mm")
                : "N/A"}
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div className='flex-5/12 font-semibold'>Outlet</div>
            <div className='flex-7/12 text-right'>
              {workerTask.orderHeader?.outlets?.name}
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div className='flex-5/12 font-semibold'>Order Header ID</div>
            <div className='flex-7/12 text-right'>
              {workerTask.orderHeader?.id}
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div className='flex-5/12 font-semibold'>Station</div>
            <div className='flex-7/12 text-right'>{workerTask.station}</div>
          </div>
          <div className='flex justify-between w-full'>
            <div className='flex-5/12 font-semibold'>Worker</div>
            <div className='flex-7/12 text-right overflow-hidden'>
              <div className='whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:overflow-x-auto'>
                {workerTask.employee?.name ? (
                  workerTask.employee.name
                ) : (
                  <span className='text-red-500 font-semibold'>No assigned worker</span>
                )}
              </div>
            </div>
          </div>
          <div className='bg-muted p-1 w-full rounded-md border-1 border-border'>
            <div className='text-center font-semibold'>{workerTask.status}</div>
          </div>
          <div className='relative flex w-full items-center py-2'>
            <div className='flex-grow border-t-2 border-primary'></div>
          </div>
        </div>

        <div className='flex flex-col gap-4 w-full'>
          <div className='font-semibold'>Order Item Details</div>
          <div className='flex flex-col gap-2'>
            {workerTask.orderHeader?.OrderItem?.map((orderItem, i) =>
              orderItem.orderItemLaundry?.map((laundry, j) => (
                <div key={`${i}-${j}`} className='flex justify-between'>
                  <span>{laundry.laundryItem?.name}</span>
                  <span>{laundry.qty}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className='relative flex w-full items-center py-1'>
          <div className='flex-grow border-t-2 border-primary'></div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <WorkerReCountForm
            initialValues={initialValues}
            laundryNames={laundryNames}
            workerTaskStatus={workerTask.status}
            isTakenByWorker={workerTask.employee}
          />

          <RequestBypassForm 
            workerTask={workerTask}
            workerTaskId={workerTask.id}
          />
        </div>

        <ProcessWorkerTaskButton
          onProcess={() => processWorkerTask(workerTask.id)}
          isProcessing={isProcessingWorkerTask}
          workerTask={workerTask}
        />
      </div>
    </div>
  );
}

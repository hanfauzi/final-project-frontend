"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WorkerTask, WorkerTaskStatus } from "@/types/workerTask";

interface ValidateReCountButtonProps {
  workerTask: WorkerTask;
  isPending: boolean;
  onProcess: () => void;
}

export default function ValidateReCountButton({
  workerTask,
  isPending,
  onProcess,
}: ValidateReCountButtonProps) {
  const [open, setOpen] = useState(false);

  const disabled =
    isPending ||
    workerTask.employee === null ||
    workerTask.isBypassRequired && workerTask.isReqAprooved !== false ||
    workerTask.isItemValidated ||
    workerTask.status === WorkerTaskStatus.IN_PROGRESS ||
    workerTask.status === WorkerTaskStatus.DONE;

  const buttonLabel = isPending
    ? (
        <>
          <div className='loading loading-spinner loading-xs' />
          Validating...
        </>
      )
    : workerTask.employee === null
    ? "Process this task before validate"
    : workerTask.status === WorkerTaskStatus.IN_PROGRESS ||
      workerTask.status === WorkerTaskStatus.DONE ||
      workerTask.isItemValidated
    ? "Already validated"
    : "Validate Items";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          disabled={disabled}
          variant='outline'
          className='w-full border-primary'
        >
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to validate items?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type='button'
              onClick={() => {
                onProcess();
                setOpen(false);
              }}
              disabled={disabled}
            >
              {isPending ? "Validating..." : "Continue"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

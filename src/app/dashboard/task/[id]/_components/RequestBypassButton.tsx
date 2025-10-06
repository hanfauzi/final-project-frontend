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

interface RequestBypassButtonProps {
  workerTask: WorkerTask;
  isPending: boolean;
  onProcess: () => void;
}

export default function RequestBypassButton({
  workerTask,
  isPending,
  onProcess,
}: RequestBypassButtonProps) {
  const [open, setOpen] = useState(false);

  const disabled =
    isPending ||
    !workerTask.isBypassRequired ||
    workerTask.bypassReq ||
    workerTask.status === WorkerTaskStatus.DONE

  const buttonLabel = isPending
    ? (
        <>
          <div className='loading loading-spinner loading-xs' />
          Submitting...
        </>
      )
    : !workerTask.isBypassRequired
    ? "This task does not require a bypass"
    : workerTask.bypassReq
    ? "Bypass already requested"
    : "Request Bypass"

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          disabled={disabled}
          variant='outline'
          className='w-full border-destructive'
        >
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to request a bypass?
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
              {isPending ? "Submitting..." : "Continue"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

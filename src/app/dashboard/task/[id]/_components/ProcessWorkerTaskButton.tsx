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
import { WorkerTask, WorkerTaskStatus } from "@/types/workerTask";

type ProcessWorkerTaskButtonProps = {
  onProcess: () => void;
  isProcessing?: boolean;
  workerTask: WorkerTask;
};

export default function ProcessWorkerTaskButton({
  onProcess,
  isProcessing = false,
  workerTask,
}: ProcessWorkerTaskButtonProps) {
  const isButtonDisabled =
    isProcessing ||
    workerTask.status === WorkerTaskStatus.DONE ||
    (workerTask.isBypassRequired && workerTask.isReqAprooved !== true);

  const buttonLabel = (workerTask: WorkerTask, isProcessing: boolean) => {
    if (isProcessing) {
      return (
        <>
          <div className="loading loading-spinner loading-xs" />
          Processing...
        </>
      );
    }

    if (workerTask.isBypassRequired) {
      if (workerTask.isReqAprooved === true) return "Process Task";
      if (workerTask.isReqAprooved === false) return "Please re-validate the item";
      if (workerTask.isReqAprooved === null) return "Bypass Required!";
    }

    switch (workerTask.status) {
      case "PENDING":
        return "Assign Task";
      case "ASSIGNED":
        return "Start task";
      case "IN_PROGRESS":
        return "Mark as done";
      case "DONE":
        return "This task is already completed! ✅";
      default:
        return "Process Task";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          className={`h-10 w-full rounded-md 
            ${
              workerTask.isBypassRequired && workerTask.isReqAprooved === true
                ? ""
                : workerTask.isBypassRequired &&
                  (workerTask.isReqAprooved !== false ||
                    workerTask.isReqAprooved !== null)
                ? "bg-red-400 hover:bg-red-500 text-white"
                : ""
            }`}
          disabled={isButtonDisabled}
        >
          {buttonLabel(workerTask, isProcessing)}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure want to proceed this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onProcess} disabled={isButtonDisabled}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
    (workerTask.isBypassRequired && !workerTask.isReqAprooved);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          className={`h-10 w-full rounded-md 
            ${
              workerTask.isBypassRequired && !workerTask.isReqAprooved
                ? "bg-red-400 hover:bg-red-500 text-white"
                : ""
            }`}
          disabled={isButtonDisabled}
        >
          {isProcessing
            ? "Processing..."
            : workerTask.status === WorkerTaskStatus.DONE
            ? "This task is already completed! ✅"
            : workerTask.isBypassRequired && !workerTask.isReqAprooved
            ? "Bypass Required!"
            : "Process Task"}
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

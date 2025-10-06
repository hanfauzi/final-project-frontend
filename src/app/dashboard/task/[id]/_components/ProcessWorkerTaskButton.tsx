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
          {isProcessing
            ? (
                <>
                  <div className='loading loading-spinner loading-xs' />
                  Processing...
                </>
              )
            : workerTask.status === WorkerTaskStatus.DONE
            ? "This task is already completed! ✅"
            : workerTask.isBypassRequired && workerTask.isReqAprooved === true
            ? "Process Task"
            : workerTask.isBypassRequired && workerTask.isReqAprooved === false
            ? "Please re-validate the item"
            : workerTask.isBypassRequired && workerTask.isReqAprooved === null
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

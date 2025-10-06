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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useClockOutAttendance from "../_hooks/useClockOutAttendance";

const ClockOutButton = () => {
  const { mutate: clockOut, isPending, isSuccess } = useClockOutAttendance();

  const handleClick = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clockOut({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        toast.error("Failed to get your location. Please allow location access.");
      }
    );
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full font-bold" disabled={isPending || isSuccess}>
            {isPending ? (
              <>
                <div className="loading loading-spinner loading-xs"></div>
                Clocking Out...
              </>
            ) : isSuccess ? (
              "Clocked Out ✅"
            ) : (
              "Clock Out"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure want to clock out now?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClick} disabled={isPending || isSuccess}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClockOutButton;

"use client";

import { CheckCircle2, Circle, CircleAlert, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceStatus } from "@/types/attendance";

interface AttendanceStatusProps {
  loading: boolean;
  error?: string | null;
  todayAttendance?: { status: AttendanceStatus } | null;
  todayAttendances?: any[];
}

const AttendanceStatusCard = ({
  loading,
  error,
  todayAttendance,
  todayAttendances,
}: AttendanceStatusProps) => {
  let statusMessage: React.ReactNode = "No attendance data fetched";
  let statusColor = "bg-white";
  let StatusIcon = Circle;

  if (loading) {
    statusMessage = <Skeleton className="h-4 my-1 w-70" />;
  } else if (error) {
    statusMessage = "Failed to load today's attendance";
    statusColor = "bg-red-100 shadow-md border-2 border-red-300";
    StatusIcon = CircleAlert;
  } else if (todayAttendance) {
    switch (todayAttendance.status) {
      case AttendanceStatus.PRESENT:
        statusMessage = "You are present today";
        statusColor = "bg-green-100 shadow-md border-2 border-green-300";
        StatusIcon = CheckCircle2;
        break;
      case AttendanceStatus.LATE:
        statusMessage = "You are late today";
        statusColor = "bg-yellow-100 shadow-md border-2 border-yellow-300";
        StatusIcon = Clock;
        break;
      case AttendanceStatus.ABSENT:
        statusMessage = "You are absent today";
        statusColor = "bg-red-100 shadow-md border-2 border-red-300";
        StatusIcon = CircleAlert;
        break;
    }
  } else if (todayAttendances && todayAttendances.length === 0) {
    statusMessage = "You haven't clocked in yet";
    statusColor = "bg-red-100 shadow-md border-2 border-red-300";
    StatusIcon = CircleAlert;
  } else {
    statusMessage = <Skeleton className="h-4 my-1 w-70" />;
    statusColor = "bg-white";
    StatusIcon = Circle;
  }

  return (
    <div className={`${statusColor} px-4 py-2 rounded-xl shadow-sm`}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="font-bold">Attendance status :</div>
          <div>{statusMessage}</div>
        </div>
        <StatusIcon className="size-8" />
      </div>
    </div>
  );
};

export default AttendanceStatusCard;
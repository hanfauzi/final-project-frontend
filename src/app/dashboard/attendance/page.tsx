"use client";

import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import ClockInButton from "./_components/ClockInButton";
import { AttendanceCalendar } from "./_components/AttendanceCalendar";
import AttendanceStatusCard from "./_components/AttendanceStatusCard";
import ClockOutButton from "./_components/ClockOutButton";
import useGetAttendanceByEmployee from "./_hooks/useGetAttendanceByEmployee";
import useGetEmployee from "../_hooks/useGetEmployee";

const AttendancePage = () => {
  const { data: employee, isLoading: employeeLoading, error: employeeError } = useGetEmployee();
  const [month, setMonth] = useState(new Date());
  const yearMonth = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const monthlyQuery = useMemo(() => ({ yearMonth }), [yearMonth]);
  const {
    data: attendances,
    isLoading: attendanceLoading,
    isError: isAttendancesError,
    error: attendancesError,
  } = useGetAttendanceByEmployee(monthlyQuery);

  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const todayYearMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const todayQuery = useMemo(() => ({ yearMonth: todayYearMonth }), [todayYearMonth]);

  const {
    data: todayAttendances,
    isLoading: todayAttendanceLoading,
    isError: todayAttendanceError,
  } = useGetAttendanceByEmployee(todayQuery);

  const todayAttendance = todayAttendances?.find((a) => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  return (
    <div className="flex flex-col gap-4 px-3 pt-4 pb-20 min-h-[calc(100vh-48px)] bg-neutral-50">
      <div>
        <h1>Hello, <span className="font-bold">{employee?.name ?? "User"}</span></h1>
        <h2>This is your attendance status</h2>
      </div>
      <div className="flex flex-col gap-4">
        <AttendanceStatusCard
          loading={todayAttendanceLoading}
          error={todayAttendanceError ? "Failed to load attendance" : null}
          todayAttendance={todayAttendance ?? null}
          todayAttendances={todayAttendances}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl px-4 py-2 bg-white shadow-md border-2 border-primary/50">
            <div className="flex flex-col gap-2 justify-between h-full">
              <div className="flex justify-between">
                <div className="font-bold">My schedule</div>
                <ChevronRight />
              </div>
              <div className="flex flex-col">
                {employeeLoading && (
                  <div className="flex flex-col">
                    <Skeleton className="h-4 my-1 w-full" />
                    <Skeleton className="h-4 my-1 w-full" />
                  </div>
                )}
                {employeeError && (
                  <div className="text-red-500 text-sm">
                    Failed to load schedule
                  </div>
                )}
                {!employeeLoading && !employeeError && (
                  <div className="flex flex-col">
                    {employee?.shift?.name ? (
                      <div>{employee.shift.name}</div>
                    ) : (
                      <Skeleton className="h-4 my-1 w-full" />
                    )}
                    {employee?.shift ? (
                      <div>
                        {employee.shift.startTime.slice(0, 5)} -{" "}
                        {employee.shift.endTime.slice(0, 5)}
                      </div>
                    ) : (
                      <Skeleton className="h-4 my-1 w-full" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <a href="/dashboard/attendance/history" className="rounded-xl px-4 py-2 bg-white shadow-md border-2 border-primary/50">
            <div className="flex flex-col gap-2 justify-between h-full">
              <div className="flex justify-between">
                <div className="font-bold">Attendance history</div>
                <ChevronRight />
              </div>
              <div>See the attendance detail here</div>
            </div>
          </a>
        </div>

        <div className="flex flex-col items-center bg-white border-1 rounded-md shadow-sm">
          <AttendanceCalendar
            data={attendances ?? []}
            month={month}
            onMonthChange={setMonth}
            loading={attendanceLoading}
          />
          {attendanceLoading && (
            <div className="pb-4 text-center text-gray-500">
              Loading attendance...
            </div>
          )}
          {isAttendancesError && (
            <div className="pb-4 text-center text-red-500">
              {attendancesError?.message ?? "Failed to load attendance"}
            </div>
          )}
          {!attendanceLoading && !isAttendancesError && (attendances?.length ?? 0) === 0 && (
            <div className="pb-4 text-center text-gray-500">
              No attendance records found in this month
            </div>
          )}
          <div className="flex justify-center gap-5 pb-4">
            <Badge className="font-bold text-black bg-white border-2 border-green-500 shadow-md">Present</Badge>
            <Badge className="font-bold text-black bg-white border-2 border-yellow-500 shadow-md">Late</Badge>
            <Badge className="font-bold text-black bg-white border-2 border-red-500 shadow-md">Absent</Badge>
          </div>
        </div>

        {!todayAttendanceLoading && !todayAttendanceError && todayAttendances && (
          <div className="flex flex-col items-center gap-2">
            {!todayAttendance ? (
              <ClockInButton />
            ) : !todayAttendance.clockOutAt ? (
              <ClockOutButton />
            ) : (
              <div>You have already clocked out ✅</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendancePage;
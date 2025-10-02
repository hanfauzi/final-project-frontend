"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import useGetAttendanceByEmployee from '../_hooks/useGetAttendanceByEmployee';
import { useEmployee } from '../../_context/EmployeeContext';
import { DateRangePicker } from '@/components/DateRangePicker';
import PaginationSection from '@/components/PaginationSection';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Attendance = () => {
  const { employee } = useEmployee();

  const handleDateChange = (date: { from: string; to: string }) => {
    if (date.from !== dateRange?.from || date.to !== dateRange?.to) {
      setYearMonth("");
      setDateRange(date);
      setPage(1);
    }
  };
  const [dateRange, setDateRange] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [page, setPage] = useState(1);

  const now = new Date();
  const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [yearMonth, setYearMonth] = useState<string>(defaultYearMonth);

  const handleMonthChange = (value: string) => {
    setYearMonth(value || "");
    setDateRange(null);
    setPage(1);
  };

  const monthlyQuery = useMemo(() => ({ yearMonth, page }), [yearMonth, page]);

  const {
    data: attendances,
    isLoading: attendanceLoading,
    isError: isAttendancesError,
  } = useGetAttendanceByEmployee({
    yearMonth: monthlyQuery.yearMonth, 
    take: 10, 
    page,
    fromDate: dateRange?.from,
    toDate: dateRange?.to, 
  });
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="flex flex-col gap-4 px-3 pt-4 pb-20 min-h-[calc(100vh-48px)] bg-neutral-50">
      <div>
        <h1>Hello, <span className="font-bold">{employee?.name ?? "User"}</span></h1>
        <h2>This is your attendance history</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">Attendance history</div>
          <div className="flex gap-2">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateChange}
            />
            <Select
              value={yearMonth ?? ""}
              onValueChange={handleMonthChange}
            >
              <div className="relative w-full">
                <SelectTrigger
                  className={cn(
                  "w-full bg-card shadow-md hover:cursor-pointer hover:bg-primary/10 hover:text-primary",
                  yearMonth ? "pr-10" : "pr-2"
                )}
                >
                  <SelectValue placeholder="Pick a month" />
                </SelectTrigger>
                {yearMonth && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { 
                      e.stopPropagation() 
                      setYearMonth("") 
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem
                    key={index}
                    value={`${new Date().getFullYear()}-${String(index + 1).padStart(2, "0")}`}
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows table-pin-cols">
              <thead>
                <tr className="bg-transparent text-primary">
                  <td>Date</td>
                  <td>Status</td>
                  <td>Clock-in At</td>
                  <td>Clock-out At</td>
                  <td>Late Minutes</td>
                  <td>Early Leave Minutes</td>
                  <td>Work Minutes</td>
                  <td>Notes</td>
                  <th className="bg-transparent"></th>
                </tr>
              </thead>
              <tbody>
                {attendanceLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      Loading attendance history...
                    </td>
                  </tr>
                ) : isAttendancesError ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-red-500">
                      {isAttendancesError}
                    </td>
                  </tr>
                ) : !attendances || attendances.data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      No attendance history
                    </td>
                  </tr>
                ) : (
                  attendances.data.map((attendance, index) => (
                    <tr
                      key={attendance.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } [&>*]:py-3`}
                    >
                      <td className="whitespace-nowrap">
                        {format(parseISO(attendance.date), "EEE, dd-MM-yyyy")}
                      </td>
                      <td>{attendance.status}</td>
                      <td>{format(parseISO(attendance.clockInAt), "HH:mm:ss")}</td>
                      <td>
                        {attendance.clockOutAt
                          ? format(parseISO(attendance.clockOutAt), "HH:mm:ss")
                          : "-"}
                      </td>
                      <td>{attendance.lateMinutes ?? "-"}</td>
                      <td>{attendance.earlyLeaveMinutes ?? "-"}</td>
                      <td>{attendance.workMinutes ?? "-"}</td>
                      <td>{attendance.notes ?? "-"}</td>
                      <th className="bg-transparent"></th>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {attendances && (
            <div className="flex justify-center items-center">
              <div>
                <PaginationSection meta={attendances.meta} setPage={setPage} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Attendance;
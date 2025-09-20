"use client";

import * as React from "react";
import "react-day-picker/dist/style.css";
import { Attendance, AttendanceStatus } from "@/types/attendance";
import { Calendar } from "@/components/ui/calendar";

interface AttendanceCalendarProps {
  data: Attendance[];
  month: Date;
  onMonthChange: (month: Date) => void;
  loading?: boolean;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function AttendanceCalendar({ data, month, onMonthChange, loading = false }: AttendanceCalendarProps) {
  const disableModifiers = loading || data.length === 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendanceMap: Record<string, AttendanceStatus> = {};
  data.forEach((attendance) => {
    const d = new Date(attendance.date);
    const localDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dateKey = formatDateKey(localDate);
    attendanceMap[dateKey] = attendance.status;
  });

  const attendanceDates = new Set(Object.keys(attendanceMap));

  const missingDates: Date[] = [];
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
    const current = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dateKey = formatDateKey(current);

    const isPast = current < today;
    const isWeekend = current.getDay() === 0 || current.getDay() === 6;
    const hasAttendance = attendanceDates.has(dateKey);

    if (isPast && !isWeekend && !hasAttendance) {
      missingDates.push(current);
    }
  }

  const normalizeDatesByStatus = (status: AttendanceStatus) =>
    Object.entries(attendanceMap)
      .filter(([, s]) => s === status)
      .map(([date]) => {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      });

  return (
    <Calendar
      mode="single"
      month={month}
      showOutsideDays
      onMonthChange={onMonthChange}
      onSelect={() => {}}
      classNames={{
        day: loading 
          ? "m-[4px] p-[0] size-[36px] flex items-center justify-center rounded-md bg-white animate-pulse"
          : "m-[4px] p-[0] size-[36px] flex items-center justify-center font-semibold cursor-default pointer-events-none",
        outside: loading ? "invisible" : "invisible",
        selected: "",
      }}
      className="bg-transparent p-1"
      modifiers={disableModifiers ? {} : {
        present: normalizeDatesByStatus(AttendanceStatus.PRESENT),
        late: normalizeDatesByStatus(AttendanceStatus.LATE),
        absent: normalizeDatesByStatus(AttendanceStatus.ABSENT),
        missing: missingDates,
      }}
      modifiersClassNames={disableModifiers ? {} : {
        present: "border-2 border-green-400 shadow-md rounded-md",
        late: "border-2 border-yellow-400 shadow-md rounded-md",
        absent: "border-2 border-red-400 shadow-md rounded-md",
        missing: "border-2 border-red-400 shadow-md rounded-md",
      }}
    />
  );
}
import { Employee } from "./employee";
import { Outlet } from "./outlet";
import { Shift } from "./shift";

export interface Attendance {
  id: string;
  name: string;
  date: string;
  status: AttendanceStatus;
  clockInAt: string;
  clockOutAt: string | null;
  workMinutes: number | null;
  lateMinutes: number
  earlyLeaveMinutes: number | null
  notes: string | null;

  employees?: Employee;
  shift?: Shift;
  outlet?: Outlet;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EARLY_LEAVE = "EARLY_LEAVE",
  ON_LEAVE = "ON_LEAVE",
  SICK = "SICK",
  HOLIDAY = "HOLIDAY",
}
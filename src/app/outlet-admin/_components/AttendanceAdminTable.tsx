"use client";

import { Attendance } from "@/types/attendance";
import { PageableResponse } from "@/types/pagination";
import { format, parseISO } from "date-fns";

type AttendanceTableProps = {
  attendances?: PageableResponse<Attendance>;
  loading?: boolean;
  error?: string | null;
};

const AttendanceAdminTable = ({ attendances, loading, error }: AttendanceTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr className="bg-transparent text-primary">
            <td>Date</td>
            <td>Status</td>
            <td>Employee</td>
            <td>Clock-in At</td>
            <td>Clock-out At</td>
            <td>Late Minutes</td>
            <td>Early Leave Minutes</td>
            <td>Work Minutes</td>
            <th className="bg-transparent"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500">
                Loading attendance history...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-red-500">
                {String(error)}
              </td>
            </tr>
          ) : !attendances || attendances.data.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500">
                No attendance history
              </td>
            </tr>
          ) : (
            attendances.data.map((attendance: Attendance, index: number) => (
              <tr
                key={attendance.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} [&>*]:py-3`}
              >
                <td className="whitespace-nowrap">
                  {format(parseISO(attendance.date), "EEE, dd-MM-yyyy")}
                </td>
                <td>{attendance.status}</td>
                <td>{attendance.employees?.email}</td>
                <td>{format(parseISO(attendance.clockInAt), "HH:mm:ss")}</td>
                <td>
                  {attendance.clockOutAt
                    ? format(parseISO(attendance.clockOutAt), "HH:mm:ss")
                    : "-"}
                </td>
                <td>{attendance.lateMinutes ?? "-"}</td>
                <td>{attendance.earlyLeaveMinutes ?? "-"}</td>
                <td>{attendance.workMinutes ?? "-"}</td>
                <th className="bg-transparent"></th>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceAdminTable;

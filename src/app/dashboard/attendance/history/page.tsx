"use client";

import { format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import useGetEmployee from '../../_hooks/useGetEmployee';
import useGetAttendanceByEmployee from '../_hooks/useGetAttendanceByEmployee';

const Attendance = () => {
  const { employee } = useGetEmployee()
  const now = new Date();
  const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [yearMonth, setYearMonth] = useState<string>(defaultYearMonth);
  const monthlyQuery = useMemo(() => ({ yearMonth }), [yearMonth]);
  const { attendances, loading, error } = useGetAttendanceByEmployee(monthlyQuery)
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="flex flex-col gap-4 px-3 pt-4 pb-20 min-h-[calc(100vh-48px)] bg-secondary">
      <div>
        <h1>Hello, <span className="font-bold">{employee?.name ?? "User"}</span></h1>
        <h2>This is your attendance history</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">Attendance history</div>
          <select 
            value={yearMonth ?? ""}
            onChange={(e) => setYearMonth(e.target.value || defaultYearMonth)}
            className="select bg-white">
            <option disabled={true} value="">Pick a month</option>
            {months.map((month, index) => (
              <option key={index} value={`${new Date().getFullYear()}-${String(index + 1).padStart(2, "0")}`}>
                {month}
              </option>
            ))}
          </select>
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
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      Loading attendance history...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : attendances.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      No attendance history
                    </td>
                  </tr>
                ) : (
                  attendances.map((attendance, index) => (
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
        </div>
      </div>
    </div>
  )
}

export default Attendance;
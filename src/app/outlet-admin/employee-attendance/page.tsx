"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import PageHeader from "@/components/PageHeader";
import PaginationSection from "@/components/PaginationSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import AttendanceAdminTable from "../_components/AttendanceAdminTable";
import useGetAttendanceByAdmin from "../_hooks/useGetAttendancesByAdmin";

const EmployeeAttendancePage = () => {
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounceValue(search, 1000);

  useEffect(() => {
    setPage(1);
  }, [debounceSearch]);

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
    error: attendancesError,
  } = useGetAttendanceByAdmin({
    yearMonth: monthlyQuery.yearMonth, 
    take: 10, 
    page,
    fromDate: dateRange?.from,
    toDate: dateRange?.to, 
    search: debounceSearch,
  });
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="ATTENDANCE"
        rightElement={
          <Image
            src={"/logo-text-laundr.png"}
            alt="laundr image"
            width={100}
            height={50}
            className="rounded-full"
          />
        }
      />
      <div className="py-6 space-y-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="font-semibold">Employee Attendance</div>
            <Input
              type="text"
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="flex items-center md:w-[200px] lg:w-[400px]"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn(
                "flex gap-2", 
                dateRange?.from && dateRange?.to ? "flex-col" : "flex-row"
              )}
            >
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
            <AttendanceAdminTable
              attendances={attendances}
              loading={attendanceLoading}
              error={attendancesError?.message ?? null}
            />
            {attendances && (
              <div className="flex justify-center items-center">
                <PaginationSection meta={attendances.meta} setPage={setPage} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeAttendancePage;

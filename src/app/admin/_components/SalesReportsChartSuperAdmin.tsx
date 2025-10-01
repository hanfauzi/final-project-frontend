"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  endOfYear,
  format,
  isAfter,
  isBefore,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useOutlets } from "../_hooks/useOutlets";

interface ReportChartProps {
  data: { period: string; total: number }[];
}

export function SalesReportsChartSuperAdmin({ data }: ReportChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: outlets } = useOutlets();

  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined
  );

  const [outletId, setOutletId] = useState(
    searchParams.get("outletId") || "all"
  );

  const today = new Date();

  const generateCompleteRange = () => {
    const range: string[] = [];

    if (filterType === "day") {
      const start = startDate ? new Date(startDate) : addDays(today, -6);
      const end = endDate ? new Date(endDate) : today;
      for (let d = start; d <= end; d = addDays(d, 1)) {
        range.push(format(d, "dd/MM/yyyy"));
      }
    } else if (filterType === "month") {
      const start = startDate
        ? startOfMonth(new Date(startDate))
        : addMonths(today, -5);
      const end = endDate ? endOfMonth(new Date(endDate)) : today;
      for (let d = start; d <= end; d = addMonths(d, 1)) {
        range.push(format(d, "MM/yyyy"));
      }
    } else if (filterType === "year") {
      const start = startDate
        ? startOfYear(new Date(startDate))
        : addYears(today, -4);
      const end = endDate ? endOfYear(new Date(endDate)) : today;
      for (let d = start; d <= end; d = addYears(d, 1)) {
        range.push(format(d, "yyyy"));
      }
    }

    return range;
  };

  // Filter data by outlet & date
  const filteredData = data.filter(({ period }) => {
    const date = new Date(period);
    if (startDate && isBefore(date, new Date(startDate))) return false;
    if (endDate && isAfter(date, new Date(endDate))) return false;
    if (outletId && outletId !== "all" && outletId !== outletId) return false;
    return true;
  });

  const completeRange = generateCompleteRange();
  const groupedData: Record<string, number> = {};
  completeRange.forEach((key) => (groupedData[key] = 0));
  filteredData.forEach(({ period, total }) => {
    let key = "";
    const date = new Date(period);
    if (filterType === "day") key = format(date, "dd/MM/yyyy");
    else if (filterType === "month") key = format(date, "MM/yyyy");
    else key = format(date, "yyyy");

    if (groupedData[key] !== undefined) groupedData[key] += total;
  });

  const formattedData = Object.entries(groupedData).map(([period, total]) => ({
    period,
    total,
  }));

  const totalToday = filteredData
    .filter(
      ({ period }) =>
        format(new Date(period), "dd/MM/yyyy") === format(today, "dd/MM/yyyy")
    )
    .reduce((sum, d) => sum + d.total, 0);
  const totalMonth = filteredData
    .filter(
      ({ period }) =>
        format(new Date(period), "MM/yyyy") === format(today, "MM/yyyy")
    )
    .reduce((sum, d) => sum + d.total, 0);
  const totalYear = filteredData
    .filter(
      ({ period }) => format(new Date(period), "yyyy") === format(today, "yyyy")
    )
    .reduce((sum, d) => sum + d.total, 0);

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (outletId && outletId !== "all") params.set("outletId", outletId);
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    router.push(`/admin/sales?${params.toString()}`);
  };

  return (
    <Card className="mt-4 ">
      <CardHeader className="flex flex-col gap-4">
        <CardTitle>Sales Report</CardTitle>

        <div className="flex gap-4 flex-wrap">
          <Select value={outletId} onValueChange={setOutletId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              {outlets?.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "day" | "month" | "year")
            }
            className="border rounded px-2 py-1"
          >
            <option value="day">Harian</option>
            <option value="month">Bulanan</option>
            <option value="year">Tahunan</option>
          </select>

          {/* Start Date Calendar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {startDate ? format(startDate, "dd/MM/yyyy") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>

          {/* End Date Calendar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {endDate ? format(endDate, "dd/MM/yyyy") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={applyFilter}>Filter</Button>
        </div>

        <div className="flex gap-4 mt-2 flex-wrap">
          <Card className="p-2 flex-1 flex flex-col justify-between">
            <CardTitle className="text-sm">{`Hari Ini (${format(
              today,
              "EEEE, dd/MM/yyyy"
            )})`}</CardTitle>
            <CardContent className="text-xl font-bold mt-auto">
              {totalToday.toLocaleString("id-ID")}
            </CardContent>
          </Card>
          <Card className="p-2 flex-1 flex flex-col justify-between">
            <CardTitle className="text-sm">{`Bulan Ini (${format(
              today,
              "MMMM yyyy"
            )})`}</CardTitle>
            <CardContent className="text-xl font-bold">
              {totalMonth.toLocaleString("id-ID")}
            </CardContent>
          </Card>
          <Card className="p-2 flex-1 flex flex-col justify-between">
            <CardTitle className="text-sm">{`Tahun Ini (${format(
              today,
              "yyyy"
            )})`}</CardTitle>
            <CardContent className="text-xl font-bold">
              {totalYear.toLocaleString("id-ID")}
            </CardContent>
          </Card>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => value.toLocaleString("id-ID")} />
              <Tooltip
                formatter={(value: number) => value.toLocaleString("id-ID")}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, addDays, addMonths, addYears, startOfMonth, endOfMonth, startOfYear, endOfYear, isAfter, isBefore } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSalesReportsOutletAdmin } from "../_hooks/useSalesReportsOutletAdmin";import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";


interface ReportChartProps {
  data: { period: string; total: number }[];
}

export function SalesReportsChartOutletAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [startDate, setStartDate] = useState<string>(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState<string>(searchParams.get("endDate") || "");

  const { data = [] } = useSalesReportsOutletAdmin({ startDate, endDate });

  console.log("data >>>>>>>", data);
  const today = new Date();

  // Generate complete range (sama persis dengan superAdmin)
  const generateCompleteRange = () => {
    let range: string[] = [];
    if (filterType === "day") {
      const start = startDate ? new Date(startDate) : addDays(today, -6);
      const end = endDate ? new Date(endDate) : today;
      for (let d = start; d <= end; d = addDays(d, 1)) {
        range.push(format(d, "dd/MM/yyyy"));
      }
    } else if (filterType === "month") {
      const start = startDate ? startOfMonth(new Date(startDate)) : addMonths(today, -5);
      const end = endDate ? endOfMonth(new Date(endDate)) : today;
      for (let d = start; d <= end; d = addMonths(d, 1)) {
        range.push(format(d, "MM/yyyy"));
      }
    } else if (filterType === "year") {
      const start = startDate ? startOfYear(new Date(startDate)) : addYears(today, -4);
      const end = endDate ? endOfYear(new Date(endDate)) : today;
      for (let d = start; d <= end; d = addYears(d, 1)) {
        range.push(format(d, "yyyy"));
      }
    }
    return range;
  };

  // Data processing (sama persis dengan superAdmin, tapi tanpa outlet filter)
  const filteredData = data.filter(({ period }) => {
    const date = new Date(period);
    if (startDate && isBefore(date, new Date(startDate))) return false;
    if (endDate && isAfter(date, new Date(endDate))) return false;
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

  const formattedData = Object.entries(groupedData).map(([period, total]) => ({ period, total }));

  const totalToday = filteredData
    .filter(({ period }) => format(new Date(period), "dd/MM/yyyy") === format(today, "dd/MM/yyyy"))
    .reduce((sum, d) => sum + d.total, 0);

  const totalMonth = filteredData
    .filter(({ period }) => format(new Date(period), "MM/yyyy") === format(today, "MM/yyyy"))
    .reduce((sum, d) => sum + d.total, 0);

  const totalYear = filteredData
    .filter(({ period }) => format(new Date(period), "yyyy") === format(today, "yyyy"))
    .reduce((sum, d) => sum + d.total, 0);

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    router.push(`/outlet-admin/sales?${params.toString()}`);
  };

  return (
    <Card className="mt-4 ">
      <CardHeader className="flex flex-col gap-4">
        <CardTitle></CardTitle>

        <div className="flex gap-4 flex-wrap">
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value as "day" | "month" | "year")}
    className="border rounded px-2 py-1"
  >
    <option value="day">Harian</option>
    <option value="month">Bulanan</option>
    <option value="year">Tahunan</option>
  </select>

  {/* Start Date */}
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        {startDate ? format(new Date(startDate), "yyyy-MM-dd") : "Start Date"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={startDate ? new Date(startDate) : undefined}
        onSelect={(date) => date && setStartDate(format(date, "yyyy-MM-dd"))}
      />
    </PopoverContent>
  </Popover>

  {/* End Date */}
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        {endDate ? format(new Date(endDate), "yyyy-MM-dd") : "End Date"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={endDate ? new Date(endDate) : undefined}
        onSelect={(date) => date && setEndDate(format(date, "yyyy-MM-dd"))}
      />
    </PopoverContent>
  </Popover>

  <Button onClick={applyFilter}>Filter</Button>
</div>

        <div className="flex gap-4 mt-2 flex-wrap">
          <Card className="p-2 flex-1 flex flex-col justify-between">
            <CardTitle className="text-sm">{`Hari Ini (${format(today, "EEEE, dd/MM/yyyy")})`}</CardTitle>
            <CardContent className="text-xl font-bold mt-auto">{totalToday.toLocaleString("id-ID")}</CardContent>
          </Card>
          <Card className="p-2 flex-1 flex flex-col justify-between">
            <CardTitle className="text-sm">{`Bulan Ini (${format(today, "MMMM yyyy")})`}</CardTitle>
            <CardContent className="text-xl font-bold">{totalMonth.toLocaleString("id-ID")}</CardContent>
          </Card>
          <Card className="p-2 flex-1 flex flex-col justify-between">
            <CardTitle className="text-sm">{`Tahun Ini (${format(today, "yyyy")})`}</CardTitle>
            <CardContent className="text-xl font-bold">{totalYear.toLocaleString("id-ID")}</CardContent>
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
              <Tooltip formatter={(value: number) => value.toLocaleString("id-ID")} />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { FC, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import DonutChart from "@/app/admin/_components/DonutChart";
import { useOutletAdminPerformance } from "../_hooks/usePerformanceOutletAdmin";

const OutletAdminPerformanceDashboard: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : new Date("2025-09-01")
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : new Date("2025-09-25")
  );

  // Update URL ketika filter tanggal berubah
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("startDate", startDate.toISOString().slice(0, 10));
    params.set("endDate", endDate.toISOString().slice(0, 10));
    router.replace(`/outlet-admin/performances?${params.toString()}`);
  }, [startDate, endDate, router]);

  const { data, isLoading } = useOutletAdminPerformance(
    startDate.toISOString().slice(0, 10),
    endDate.toISOString().slice(0, 10)
  );

  const workerChartData =
    data?.workers.map((w) => ({
      employeeName: w.employeeName || "Unknown",
      totalDone: Number(w.totalDone),
    })) || [];

  const driverChartData =
    data?.drivers.map((d) => ({
      employeeName: d.employeeName || "Unknown",
      totalDone: Number(d.totalDone),
    })) || [];

  return (
    <div className="space-y-6">
      {/* Filter Tanggal */}
      <div className="flex items-center gap-4 mb-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {format(startDate, "yyyy-MM-dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">{format(endDate, "yyyy-MM-dd")}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Workers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Worker Performance</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : workerChartData.length > 0 ? (
          <div className="w-full h-[350px]">
            <DonutChart data={workerChartData} title="Workers" />
          </div>
        ) : (
          <p>No worker data available.</p>
        )}
      </div>

      {/* Drivers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Driver Performance</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : driverChartData.length > 0 ? (
          <div className="w-full h-[350px]">
            <DonutChart data={driverChartData} title="Drivers" />
          </div>
        ) : (
          <p>No driver data available.</p>
        )}
      </div>
    </div>
  );
};

export default OutletAdminPerformanceDashboard;

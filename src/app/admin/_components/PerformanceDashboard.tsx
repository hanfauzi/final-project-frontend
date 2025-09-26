"use client";

import { FC, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePerformance } from "../_hooks/usePerformance";
import { useOutlets } from "../_hooks/useOutlets";
import DonutChart from "./DonutChart";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// shadcn card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PerformanceDashboard: FC = () => {
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
  const [selectedOutletId, setSelectedOutletId] = useState(
    searchParams.get("outletId") || ""
  );

  const { data: outlets = [] } = useOutlets();

  // Update URL ketika filter berubah
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("startDate", startDate.toISOString().slice(0, 10));
    params.set("endDate", endDate.toISOString().slice(0, 10));
    if (selectedOutletId && selectedOutletId !== "all") {
      params.set("outletId", selectedOutletId);
    }
    router.replace(`/admin/performances?${params.toString()}`);
  }, [startDate, endDate, selectedOutletId, router]);

  const outletParam =
    selectedOutletId && selectedOutletId !== "all" ? selectedOutletId : undefined;
  const { data, isLoading } = usePerformance(
    startDate.toISOString().slice(0, 10),
    endDate.toISOString().slice(0, 10),
    outletParam
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
      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">{format(startDate, "yyyy-MM-dd")}</Button>
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

            {/* Outlet */}
            <div>
              <label className="block text-sm font-medium mb-1">Outlet</label>
              <Select
                value={selectedOutletId}
                onValueChange={(val) => setSelectedOutletId(val)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Outlets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outlets</SelectItem>
                  {outlets.map((outlet) => (
                    <SelectItem key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worker Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Worker Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : workerChartData.length > 0 ? (
            <div className="w-full h-[350px]">
              <DonutChart data={workerChartData} title="Workers" />
            </div>
          ) : (
            <p>No worker data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Driver Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : driverChartData.length > 0 ? (
            <div className="w-full h-[350px]">
              <DonutChart data={driverChartData} title="Drivers" />
            </div>
          ) : (
            <p>No driver data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;

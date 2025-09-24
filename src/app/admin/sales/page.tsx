"use client";

import { useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { SalesReportsChartSuperAdmin } from "../_components/SalesReportsChartSuperAdmin";
import { useSuperAdminSalesReport } from "../_hooks/useSalesReports";

export default function SalesReportPage() {
  const searchParams = useSearchParams();

  const outletId = searchParams.get("outletId") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const {
    data = [],
    isLoading,
    isError,
  } = useSuperAdminSalesReport({
    outletId,
    startDate,
    endDate,
  });

  return (
    <div className="space-y-6">
      {isLoading && <Skeleton className="h-[400px] w-full" />}
      {isError && <p className="text-red-500">Failed to load report</p>}
      {data && <SalesReportsChartSuperAdmin data={data} />}
    </div>
  );
}

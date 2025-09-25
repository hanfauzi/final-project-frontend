"use client";

import { useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { SalesReportsChartSuperAdmin } from "../_components/SalesReportsChartSuperAdmin";
import { useSuperAdminSalesReport } from "../_hooks/useSalesReports";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";

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
    <div className="P-6">
        <PageHeader
        title="SALES REPORT"
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
      {isLoading && <Skeleton className="h-[400px] w-full" />}
      {isError && <p className="text-red-500">Failed to load report</p>}
      {data && <SalesReportsChartSuperAdmin data={data} />}
    </div>
  );
}

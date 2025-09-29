"use client";

import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import { SalesReportsChartOutletAdmin } from "../_components/SalesReportChartOutletAdmin";


export default function OutletAdminSalesPage() {
  return (
    <div className="p-6">
     <PageHeader
        title="SALES REPORTS"
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
      <SalesReportsChartOutletAdmin />
    </div>
  );
}

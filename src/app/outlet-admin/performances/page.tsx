"use client";

import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import OutletAdminPerformanceDashboard from "../_components/PerformanceDashboardOutletAdmin";

const PerformancePage = () => {
  return (
    <div className="p-6">
      <PageHeader
        title="PERFORMANCE REPORTS"
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
      <OutletAdminPerformanceDashboard />
    </div>
  );
};

export default PerformancePage;

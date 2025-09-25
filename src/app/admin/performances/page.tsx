"use client";

import PageHeader from "@/components/PageHeader";
import PerformanceDashboard from "../_components/PerformanceDashboard";
import Image from "next/image";

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
      <PerformanceDashboard />
    </div>
  );
};

export default PerformancePage;

import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import React from "react";
import BypassRequestsPage from "../_components/BypassRequestPage";

const page = () => {
  return (
    <div className="p-6">
      <PageHeader
        title="REQUEST BYPASS"
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
      <BypassRequestsPage />
    </div>
  );
};

export default page;

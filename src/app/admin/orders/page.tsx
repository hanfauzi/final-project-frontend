"use client";

import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import GetAllOrders from "../_components/GetAllOrders";

export default function EmployeesPage() {
  return (
    <div className="p-4">
      <PageHeader
        title="ORDERS"
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
      <GetAllOrders />
    </div>
  );
}

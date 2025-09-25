"use client";

import PageHeader from "@/components/PageHeader";
import GetAllEmployees from "../_components/GetAllEmployees";
import Image from "next/image";


export default function EmployeesPage() {
  return (
    <div className="p-4">
      <PageHeader
        title="EMPLOYEES"
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
      <GetAllEmployees />
    </div>
  );
}

"use client";

import PageHeader from "@/components/PageHeader";
import GetAllEmployees from "../_components/GetAllEmployees";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import EmployeeDetail from "../_components/EmployeeDetail";

export default function EmployeesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get("id");
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
      <Dialog
        open={!!employeeId}
        onOpenChange={(open) => {
          if (!open) {
            // Tutup dialog => hapus query id
            router.push("/admin/employees");
          }
        }}
      >
        <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-hidden p-6">
          <DialogTitle >Employee Detail</DialogTitle>
          {employeeId && <EmployeeDetail id={employeeId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

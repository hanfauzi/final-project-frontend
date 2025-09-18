"use client";

import { useParams } from "next/navigation";
import EmployeeDetail from "../../_components/EmployeeDetail";

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
console.log("params", params);
console.log("id", id);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Detail</h1>
      <EmployeeDetail id={id} />
    </div>
  );
}

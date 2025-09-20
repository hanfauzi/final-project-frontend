"use client";

import GetAllEmployees from "../_components/GetAllEmployees";


export default function EmployeesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order</h1>
      <GetAllEmployees />
    </div>
  );
}

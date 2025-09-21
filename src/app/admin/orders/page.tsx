"use client";

import GetAllEmployees from "../_components/GetAllEmployees";
import GetAllOrders from "../_components/GetAllOrders";


export default function EmployeesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <GetAllOrders />
    </div>
  );
}

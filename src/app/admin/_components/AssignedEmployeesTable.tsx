"use client";

import { FC } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignedEmployeesByOutlet } from "../_hooks/useAssignedEmployeeByOutlet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AssignedEmployeesTableProps {
  outletId: string;
}

const AssignedEmployeesTable: FC<AssignedEmployeesTableProps> = ({ outletId }) => {
  const { data: employees, isLoading, isError } =
    useAssignedEmployeesByOutlet(outletId);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Assigned Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return <p className="text-red-500">Failed to load employees</p>;
  }

  if (!employees || employees.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Assigned Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No employees assigned to this outlet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Assigned Employees</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phoneNumber || "-"}</TableCell>
                <TableCell>{emp.role || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssignedEmployeesTable;

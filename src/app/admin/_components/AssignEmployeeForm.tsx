"use client";

import { FC, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEmployees } from "../_hooks/useEmployees";
import { useAssignEmployeeToOutlet } from "../_hooks/useAssignedEmployeeByOutlet";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface AssignEmployeeFormProps {
  outletId: string;
}

const AssignEmployeeForm: FC<AssignEmployeeFormProps> = ({ outletId }) => {
  const { data, isLoading } = useEmployees();
  const assignMutation = useAssignEmployeeToOutlet();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const handleConfirmAssign = () => {
    if (!selectedEmployee) return;
    assignMutation.mutate({ employeeId: selectedEmployee, outletId });
    setSelectedEmployee("");
  };

  if (isLoading) return <p>Loading employees...</p>;

  return (
    <div className="flex items-center gap-2 mt-4">
      <Select
        onValueChange={(val) => setSelectedEmployee(val)}
        value={selectedEmployee}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select employee" />
        </SelectTrigger>
        <SelectContent>
          {data?.employees.map((emp) => (
            <SelectItem key={emp.id} value={emp.id}>
              {emp.name} ({emp.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ConfirmDialog
        title="Confirm Assign"
        description={`Are you sure you want to assign this employee to the outlet?`}
        confirmText="Yes, Assign"
        cancelText="Cancel"
        onConfirm={handleConfirmAssign}
        isPending={assignMutation.isPending}
        trigger={
          <Button
            className="cursor-pointer"
            type="button"
            disabled={!selectedEmployee || assignMutation.isPending}
          >
            {assignMutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        }
      />
    </div>
  );
};

export default AssignEmployeeForm;

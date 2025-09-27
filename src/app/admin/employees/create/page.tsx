"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeRole } from "@/types/roles";
import CreateEmployeeForm from "../../_components/CreateEmployeeForm";
import { useCreateEmployee } from "../../_hooks/useEmployees";
import { EmployeeFormValues } from "../../schema/create-employee.schema";

export default function CreateEmployeePage() {
  const createEmployee = useCreateEmployee();

  const initialValues: EmployeeFormValues = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    role: "WORKER",
    outletId: "",
    shiftId: "",
    photoUrl: undefined ,
  };

  return (
    <Card className="max-w-xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Create New Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateEmployeeForm
          initialValues={initialValues}
          onSubmit={(values) =>
            createEmployee.mutate({
              ...values,
              role: values.role as EmployeeRole,
              
            })
          }
          isSubmitting={createEmployee.isPending}
        />
      </CardContent>
    </Card>
  );
}

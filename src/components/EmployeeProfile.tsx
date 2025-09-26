"use client";

import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

const EmployeeProfile = () => {
  const { data: employee, isLoading } = useEmployeeProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 p-5 text-center">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2 w-24">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    );
  }
  if (!employee) return null;

  return (
    <div className="flex flex-col items-center gap-2 p-5 text-center">
      <div className="relative w-22 h-22">
        <Image
          src={employee.photoUrl ?? "/profile-default.jpg"}
          alt={employee.email}
          fill
          className="rounded-full object-cover border border-gray-200 shadow-sm"
        />
      </div>
      <div>
        <h2 className="text-base font-semibold">{employee.name}</h2>
        <p className="text-sm text-gray-500">
          {employee.role === "SUPER_ADMIN"
            ? employee.role
            : employee.outlet?.name}
        </p>
      </div>
    </div>
  );
};

export default EmployeeProfile;

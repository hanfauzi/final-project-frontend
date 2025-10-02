"use client";

import { Mail, Map, Phone, User } from "lucide-react";
import Image from "next/image";
import DashboardLogoutButton from "./_components/DashboardLogoutButton";
import { useEmployee } from "./_context/EmployeeContext";

const DashboardPage = () => {
  const { employee, isLoading: employeeLoading } = useEmployee();

  return (
    <div className="mx-auto max-w-sm md:max-w-[800px]">
      <div className="flex flex-col gap-4 px-2 pt-4 pb-20 min-h-[calc(100vh-48px)] bg-neutral-50">
        <div>
          <h1>
            Hello, <span className="font-bold">{employee?.name ?? "User"}</span>
          </h1>
          <h2>Welcome back again!</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="bg-card shadow-md rounded-md py-6 px-4 flex flex-col gap-4">
              <div className="flex justify-center">
                {employeeLoading && <p>Loading photo...</p>}
                {employee?.photoUrl && (
                  <div className="relative size-26">
                    <Image
                      src={employee.photoUrl}
                      alt="Profile Avatar"
                      fill
                      className="object-cover rounded-full"
                      sizes="120px"
                    />
                  </div>
                )}
              </div>
              <div className="relative flex w-full items-center py-1">
                <div className="flex-grow border-t-2 border-muted"></div>
              </div>
              <div className="font-bold text-lg tracking-wider">
                Profile Info
              </div>
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <User className="size-5" />
                  <div className="font-semibold">Name</div>
                </div>
                <div>{employee?.name}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <User className="size-5" />
                  <div className="font-semibold">Role</div>
                </div>
                <div>{employee?.role}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <Mail className="size-5" />
                  <div className="font-semibold">Email</div>
                </div>
                <div>{employee?.email}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <Phone className="size-5" />
                  <div className="font-semibold">Phone Number</div>
                </div>
                <div>{employee?.phoneNumber}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <Map className="size-5" />
                  <div className="font-semibold">Address</div>
                </div>
                <div>{employee?.address}</div>
              </div>
            </div>
          </div>
          <DashboardLogoutButton />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

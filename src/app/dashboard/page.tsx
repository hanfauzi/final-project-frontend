"use client";

import { Mail, Map, Phone, User } from "lucide-react";
import Image from "next/image";
import DashboardLogoutButton from "./_components/DashboardLogoutButton";
import { useEmployee } from "./_context/EmployeeContext";
import CurrentActiveTaskCard from "./task/_components/CurrentActiveTaskCard";
import useGetDeliveryOrderById from "./task/_hooks/useGetDeliveryOrderById";
import useGetPickUpTaskById from "./task/_hooks/useGetPickUpOrderById";
import useGetWorkerTaskById from "./task/_hooks/useGetWorkerTaskById";
import AttendanceStatusCard from "./attendance/_components/AttendanceStatusCard";
import useGetAttendanceByEmployee from "./attendance/_hooks/useGetAttendanceByEmployee";
import { useMemo, useState } from "react";

const DashboardPage = () => {
  const { employee, isLoading: employeeLoading } = useEmployee();

  const { data: pickUpOrder, isLoading: pickUpOrderLoading } =
    useGetPickUpTaskById(employee?.takenTaskId ?? "", {
      enabled: !!employee?.takenTaskId && employee?.takenTaskType === "PICKUP",
    });

  const { data: deliveryOrder, isLoading: deliveryOrderLoading } =
    useGetDeliveryOrderById(employee?.takenTaskId ?? "", {
      enabled:
        !!employee?.takenTaskId && employee?.takenTaskType === "DELIVERY",
    });

  const { data: workerTask, isLoading: workerTaskLoading } =
    useGetWorkerTaskById(employee?.takenTaskId ?? "", {
      enabled:
        !!employee?.takenTaskId &&
        (employee?.takenTaskType === "WASHING" ||
          employee?.takenTaskType === "IRONING" ||
          employee?.takenTaskType === "PACKING"),
    });

  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const todayYearMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const todayQuery = useMemo(() => ({ yearMonth: todayYearMonth }), [todayYearMonth]);

  const {
    data: todayAttendances,
    isLoading: todayAttendanceLoading,
    isError: todayAttendanceError,
  } = useGetAttendanceByEmployee(todayQuery);

  const todayAttendance = todayAttendances?.data.find((a) => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  let taskUrl: string | null = null;

  if (employee?.takenTaskId) {
    switch (employee.takenTaskType) {
      case "PICKUP":
        taskUrl = `/dashboard/task/pickup-order/${employee?.takenTaskId}`;
        break;
      case "DELIVERY":
        taskUrl = `/dashboard/task/delivery-order/${employee?.takenTaskId}`;
        break;
      case "WASHING":
      case "IRONING":
      case "PACKING":
        taskUrl = `/dashboard/task/${employee?.takenTaskId}`;
        break;
    }
  }

  return (
    <div className='mx-auto max-w-sm md:max-w-[800px]'>
      <div className='flex flex-col gap-4 px-2 pt-4 pb-20 min-h-[calc(100vh-48px)] bg-neutral-50'>
        <div>
          <h1>
            Hello, <span className='font-bold'>{employee?.name ?? "User"}</span>
          </h1>
          <h2>Welcome back again!</h2>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <AttendanceStatusCard
                loading={todayAttendanceLoading}
                error={
                  todayAttendanceError ? "Failed to load attendance" : null
                }
                todayAttendance={todayAttendance ?? null}
                todayAttendances={todayAttendances?.data}
              />
              <h2 className='text-lg font-bold'>Currently Active Tasks</h2>
              {employee?.takenTaskId && taskUrl ? (
                employee.takenTaskType === "PICKUP" ? (
                  <CurrentActiveTaskCard
                    href={taskUrl}
                    loading={pickUpOrderLoading}
                    createdAt={pickUpOrder?.createdAt}
                    id={pickUpOrder?.id}
                    status={pickUpOrder?.status}
                  />
                ) : employee.takenTaskType === "DELIVERY" ? (
                  <CurrentActiveTaskCard
                    href={taskUrl}
                    loading={deliveryOrderLoading}
                    createdAt={deliveryOrder?.createdAt}
                    id={deliveryOrder?.id}
                    status={deliveryOrder?.status}
                  />
                ) : (
                  <CurrentActiveTaskCard
                    href={taskUrl}
                    loading={workerTaskLoading}
                    createdAt={workerTask?.createdAt}
                    id={workerTask?.id}
                    status={workerTask?.status}
                  />
                )
              ) : (
                <div className='text-center p-3 rounded-md border bg-card'>
                  You are currently not taking any task
                </div>
              )}
            </div>
            <div className='bg-card shadow-md rounded-md mt-2 py-6 px-4 flex flex-col gap-4'>
              <div className='flex justify-center'>
                {employeeLoading && <p>Loading photo...</p>}
                {employee?.photoUrl && (
                  <div className='relative size-26'>
                    <Image
                      src={employee.photoUrl}
                      alt='Profile Avatar'
                      fill
                      className='object-cover rounded-full'
                      sizes='120px'
                    />
                  </div>
                )}
              </div>
              <div className='relative flex w-full items-center py-1'>
                <div className='flex-grow border-t-2 border-muted'></div>
              </div>
              <div className='font-bold text-lg tracking-wider'>
                Profile Info
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                  <User className='size-5' />
                  <div className='font-semibold'>Name</div>
                </div>
                <div>{employee?.name}</div>
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                  <User className='size-5' />
                  <div className='font-semibold'>Role</div>
                </div>
                <div>{employee?.role}</div>
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                  <User className='size-5' />
                  <div className='font-semibold'>Outlet</div>
                </div>
                <div>{employee?.outlet?.name}</div>
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                  <Mail className='size-5' />
                  <div className='font-semibold'>Email</div>
                </div>
                <div>{employee?.email}</div>
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                  <Phone className='size-5' />
                  <div className='font-semibold'>Phone Number</div>
                </div>
                <div>{employee?.phoneNumber}</div>
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                  <Map className='size-5' />
                  <div className='font-semibold'>Address</div>
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

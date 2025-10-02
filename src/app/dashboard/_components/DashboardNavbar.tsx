"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEmployee } from "../_context/EmployeeContext";
import dynamic from "next/dynamic";

export default function DashboardNavbar() {
  const DriverNotification = dynamic(() => import("./DriverNotification"), { ssr: false });

  const router = useRouter();
  const pathname = usePathname();

  const hideBackOn = ["/", "/dashboard", "/dashboard/attendance", "/dashboard/task"]; 
  const shouldShowBackBtn = !hideBackOn.includes(pathname);

  const { employee} = useEmployee();

  return (
    <div className="sticky top-0 z-50 bg-neutral-50/80 backdrop-blur">
      <div className="shadow-sm">
        <div className="relative mx-auto max-w-sm md:max-w-full h-12 px-4 flex items-center justify-center">
          {shouldShowBackBtn && (
            <button
              onClick={() => router.back()}
              className="absolute left-4 p-2 rounded-md hover:cursor-pointer hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-900" />
            </button>
          )}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-block px-2 py-1 mx-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              aria-label="Ke beranda"
            >
              <div className="relative h-7 w-[112px] sm:h-8 sm:w-[128px] md:h-9 md:w-[150px] shrink-0">
                <Image
                  src="/logo-text-laundr.png"
                  alt="Laundr"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 128px, 150px"
                  priority
                />
              </div>
            </Link>
          </div>
          {employee && (
            <div className="absolute right-4">
              {employee.role === "DRIVER" && <DriverNotification />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
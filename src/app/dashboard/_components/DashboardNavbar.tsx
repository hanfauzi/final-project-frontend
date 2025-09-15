"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const hideBackOn = ["/", "/dashboard", "/dashboard/attendance", "/dashboard/task"]; 
  const shouldShowBackBtn = !hideBackOn.includes(pathname);

  return (
    <div className="sticky top-0 z-50 bg-neutral-50/80 backdrop-blur">
      <div className="shadow-sm">
        <div className="relative mx-auto max-w-sm h-12 px-4 flex items-center justify-center">
          {shouldShowBackBtn && (
            <button
              onClick={() => router.back()}
              className="absolute left-4 p-2 rounded-md hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-900" />
            </button>
          )}
          <div className="text-[17px] font-bold tracking-tight text-neutral-900 select-none">
            <Link
              href="/"
              className="inline-block px-2 py-1 mx-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              aria-label="Ke beranda"
            >
              Laundr
            </Link>
          </div>
          <div className="absolute right-4">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type CurrentActiveTaskCardProps = {
  href: string;
  loading: boolean;
  createdAt?: string | Date | null;
  id?: string;
  status?: string;
};

export default function CurrentActiveTaskCard({
  href,
  loading,
  createdAt,
  id,
  status,
}: CurrentActiveTaskCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 p-3 rounded-md bg-card border-2 border-primary shadow-md shadow-primary/30 hover:bg-gray-100"
    >
      <div className="flex justify-between">
        {loading ? (
          <>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-12" />
          </>
        ) : (
          <>
            <small>
              {createdAt ? format(new Date(createdAt), "EEE, dd MMMM yyyy") : "N/A"}
            </small>
            <small>
              {createdAt ? format(new Date(createdAt), "HH:mm") : "N/A"}
            </small>
          </>
        )}
      </div>
      <div className="flex justify-between items-center gap-2">
        {loading ? (
          <>
            <Skeleton className="flex-5/12 h-6 w-full" />
            <Skeleton className="flex-7/12 h-6 w-full" />
          </>
        ) : (
          <>
            <p className="flex-5/12 truncate">{id ?? "N/A"}</p>
            <small className="flex-7/12 text-right">{status ?? "N/A"}</small>
          </>
        )}
      </div>
    </Link>
  );
}

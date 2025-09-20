"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { usePaginatedOutlets } from "../_hooks/useOutlets";

const GetAllOutlets: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [limit] = useState(8);
  const [page, setPage] = useState(() => Number(searchParams.get("page") || 1));
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (debouncedSearch) params.set("search", debouncedSearch);
    router.replace(`${pathname}?${params.toString()}`);
  }, [page, debouncedSearch, pathname, router]);

  // fetch outlets
  const { data, isLoading, error } = usePaginatedOutlets({
    page,
    limit,
    search: debouncedSearch,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Something went wrong</p>;

  const outlets = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) : 1;

  return (
    <div className="flex flex-col min-h-screen gap-4">
      <div className="flex justify-between items-center">
        <SearchBar
          value={searchInput}
          onChange={(val) => setSearchInput(val)}
          placeholder="Search outlets..."
        />

        <Link href="/admin/outlets/create">
          <Button className="cursor-pointer">Create New Outlet</Button>
        </Link>
      </div>

      {/* Grid Outlets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {outlets.map((outlet) => (
          <Link
            key={outlet.id}
            href={`/admin/outlets/${outlet.id}`}
            className="group"
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{outlet.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm">
                <span>{outlet.address}</span>
                <span>{outlet.cityName}</span>
                <span>{outlet.phoneNumber}</span>
                <span
                  className={`text-xs font-medium ${
                    outlet.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {outlet.isActive ? "Active" : "Inactive"}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default GetAllOutlets;

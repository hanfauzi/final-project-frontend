"use client";

import { useEmployees } from "@/app/admin/_hooks/useEmployees";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const GetAllEmployees: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [limit] = useState(8);
  const [page, setPage] = useState(() => Number(searchParams.get("page") || 1));
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (debouncedSearch) params.set("search", debouncedSearch);
    router.replace(`${pathname}?${params.toString()}`);
  }, [page, debouncedSearch, pathname, router]);

  const { data, isLoading, error } = useEmployees({
    page,
    limit,
    search: debouncedSearch,
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Something went wrong</p>;

  const employees = data?.employees ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col min-h-screen gap-4">
      <div className="flex justify-between items-center">
        <SearchBar
          value={searchInput}
          onChange={(val) => setSearchInput(val)}
        />

        <Link href="/admin/employees/create">
          <Button className="cursor-pointer">
            Create New Employee
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {employees.map((emp) => (
          <Link
            key={emp.id}
            href={`/admin/employees/${emp.id}`}
            className="group"
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{emp.name}</CardTitle>
                <CardDescription>{emp.role}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span>{emp.email}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

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

export default GetAllEmployees;

"use client";

import { useEmployees } from "@/app/admin/_hooks/useEmployees";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Card, CardContent } from "@/components/ui/card";

const GetAllEmployees: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [limit] = useState(12);
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
    <Card className="min-h-screen">
      <CardContent className="flex flex-col gap-4 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <SearchBar
            value={searchInput}
            onChange={(val) => setSearchInput(val)}
            placeholder="Search employees..."
          />

          <Link href="/admin/employees/create">
            <Button className="cursor-pointer">Create New Employee</Button>
          </Link>
        </div>

        {/* Employees Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold px-7">Name</TableHead>
                <TableHead className="font-bold px-7">Role</TableHead>
                <TableHead className="font-bold px-7">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/admin/employees?id=${emp.id}`)}
                  >
                    <TableCell className="font-medium py-4 px-6">
                      {emp.name}
                    </TableCell>
                    <TableCell className="py-5 px-7">{emp.role}</TableCell>
                    <TableCell className="py-5 px-7">{emp.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-gray-500 font-medium"
                  >
                    NO EMPLOYEES FOUND
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
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
      </CardContent>
    </Card>
  );
};

export default GetAllEmployees;

"use client";

import { useEmployees } from "@/app/admin/_hooks/useEmployees";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useOutlets } from "../_hooks/useOutlets";
import SearchBar from "./SearchBar";

const GetAllEmployees: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: outlets, isLoading: outletsLoading } = useOutlets();

  const [role, setRole] = useState<string | undefined>(
    () => searchParams.get("role") || undefined
  );
  const [outletId, setOutletId] = useState<string | undefined>(
    () => searchParams.get("outletId") || undefined
  );
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [limit] = useState(12);
  const [page, setPage] = useState(() => Number(searchParams.get("page") || 1));
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
    if (role) params.set("role", role);
    if (outletId) params.set("outletId", outletId);
    router.replace(`${pathname}?${params.toString()}`);
  }, [page, debouncedSearch, role, outletId, pathname, router]);

  const { data, isLoading, error } = useEmployees({
    page,
    limit,
    search: debouncedSearch,
    role,
    outletId,
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Something went wrong</p>;

  const employees = data?.employees ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <Card className="min-h-screen">
      <CardContent className="flex flex-col gap-4 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between  gap-4">
          <div className="flex items-center gap-4">
            <SearchBar
              value={searchInput}
              onChange={(val) => setSearchInput(val)}
              placeholder="Search employees..."
            />

            {/* Filter Role */}
            <Select
              onValueChange={(value) => {
                setRole(value === "ALL" ? undefined : value);
                setPage(1);
              }}
              value={role}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="WORKER">Worker</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
                <SelectItem value="OUTLET_ADMIN">Outlet Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Outlet */}
            <Select
              onValueChange={(value) => {
                setOutletId(value === "ALL" ? undefined : value);
                setPage(1);
              }}
              value={outletId}
              disabled={outletsLoading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Outlets</SelectItem>
                {outlets?.map((outlet: any) => (
                  <SelectItem key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Link href="/admin/employees/create">
              <Button className="cursor-pointer">Create New Employee</Button>
            </Link>
          </div>
        </div>

        {/* Employees Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold px-4 py-2">Name</TableHead>
                <TableHead className="font-bold px-4 py-2">Role</TableHead>
                <TableHead className="font-bold px-4 py-2">Email</TableHead>
                <TableHead className="font-bold px-4 py-2">Outlet</TableHead>
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
                    <TableCell className="font-medium py-3 px-4 whitespace-nowrap">
                      {emp.name}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      {emp.role}
                    </TableCell>
                    <TableCell className="py-3 px-4 break-words">
                      {emp.email}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      {emp.outlet?.name ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-gray-500 font-medium py-4"
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

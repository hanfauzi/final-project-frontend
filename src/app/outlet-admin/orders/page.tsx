"use client";

import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
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
import { OrderStatus } from "@/types/enumOrderStatus";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useOutletOrders } from "../_hooks/useOrdersOutletAdmin";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import DatePicker from "@/components/ui/date-picker";

export default function OutletOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStatus = searchParams.get("status") ?? undefined;
  const initialStartDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : null;
  const initialEndDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : null;
  const initialPage = Number(searchParams.get("page") ?? 1);

  const [status, setStatus] = useState<string | undefined>(initialStatus);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [page, setPage] = useState(initialPage);
  const limit = 10;

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (startDate)
      params.set("startDate", startDate.toISOString().split("T")[0]);
    if (endDate) params.set("endDate", endDate.toISOString().split("T")[0]);
    params.set("page", page.toString());
    router.replace(`/outlet-admin/orders?${params.toString()}`);
  }, [status, startDate, endDate, page, router]);

  const { data, isLoading, isError } = useOutletOrders({
    status,
    startDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
    endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
    page,
    limit,
  });

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-red-500">Gagal mengambil data orders.</p>;

  const orders = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <>
      <PageHeader
        title="ORDERS"
        rightElement={
          <Image
            src={"/logo-text-laundr.png"}
            alt="laundr image"
            width={100}
            height={50}
            className="rounded-full"
          />
        }
      />

      <Card className="min-h-screen">
        <CardContent className="p-6 space-y-6">
          {/* Filter Section */}
          <div className="flex gap-4 items-end flex-wrap">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                onValueChange={(v) => {
                  setStatus(v === "ALL" ? undefined : v);
                  setPage(1);
                }}
                value={status ?? "ALL"}
              >
                <SelectTrigger className="w-[200px] cursor-pointer">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="cursor-pointer">
                    ALL STATUS
                  </SelectItem>
                  {Object.values(OrderStatus).map((statusValue) => (
                    <SelectItem
                      key={statusValue}
                      value={statusValue}
                      className="cursor-pointer"
                    >
                      {statusValue.replaceAll("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <div className="w-[200px]">
                <DatePicker
                  date={startDate}
                  setDate={(d) => {
                    setStartDate(d);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <div className="w-[200px]">
                <DatePicker
                  date={endDate}
                  setDate={(d) => {
                    setEndDate(d);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[700px] text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/outlet-admin/orders/${order.id}`)
                      }
                    >
                      <TableCell className="font-medium">
                        {order.invoiceNo}
                      </TableCell>
                      <TableCell className="py-4">
                        {order.customers.name}
                      </TableCell>
                      <TableCell>{order.customers.phoneNumber}</TableCell>
                      <TableCell>
                        Rp {order.totalPrice.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "ARRIVED_AT_OUTLET"
                              ? "secondary"
                              : order.status === "COMPLETED"
                              ? "outline"
                              : "default"
                          }
                        >
                          {order.status.replaceAll("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500 font-medium"
                    >
                      NO ORDERS FOUND IN THIS STATUS
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              variant="outline"
            >
              Prev
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

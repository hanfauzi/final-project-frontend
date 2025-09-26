"use client";

import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export default function OutletOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil filter & pagination dari URL
  const initialStatus = searchParams.get("status") ?? undefined;
  const initialStartDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : null;
  const initialEndDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : null;
  const initialPage = Number(searchParams.get("page") ?? 1);

  // State lokal
  const [status, setStatus] = useState<string | undefined>(initialStatus);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [page, setPage] = useState(initialPage);
  const limit = 10; // sinkron dengan backend default

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (startDate) params.set("startDate", startDate.toISOString().split("T")[0]);
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
    <div className="p-6 space-y-6">
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

      {/* Filter Section */}
      <div className="flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select onValueChange={(v) => { setStatus(v); setPage(1); }} value={status}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(OrderStatus).map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {statusValue.replaceAll("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/outlet-admin/orders/${order.id}`)}
                >
                  <TableCell className="font-medium">{order.customers.name}</TableCell>
                  <TableCell>{order.customers.phoneNumber}</TableCell>
                  <TableCell>{order.invoiceNo}</TableCell>
                  <TableCell>Rp {order.totalPrice.toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "COMPLETED"
                          ? "secondary"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.status.replaceAll("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 font-medium">
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
        <span>Page {page} of {totalPages}</span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

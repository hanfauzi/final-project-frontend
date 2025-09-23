"use client";

import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@/types/enumOrderStatus";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useOutletOrders } from "../_hooks/useOrdersOutletAdmin";

export default function OutletOrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data, isLoading, isError, refetch } = useOutletOrders({
    status,
    startDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
    endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
  });

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-red-500">Gagal mengambil data orders.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Orders Outlet</h1>

      {/* Filter Section */}
      <div className="flex gap-4 items-end flex-wrap">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select onValueChange={(v) => setStatus(v)} value={status}>
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

        {/* Filter Button */}
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data && data.data.length > 0 ? (
          data.data.map((order) => (
            <Card
              key={order.id}
              className="shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => router.push(`/outlet-admin/orders/${order.id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {order.customers.name}
                </CardTitle>
                <Badge
                  variant={
                    order.status === "completed"
                      ? "secondary"
                      : order.status === "cancelled"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {order.status.replaceAll("_", " ").toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {order.customers.phoneNumber}
                </p>
                <p>
                  <span className="text-muted-foreground">Invoice:</span>{" "}
                  {order.invoiceNo}
                </p>
                <p>
                  <span className="text-muted-foreground">Total:</span>{" "}
                  <span className="font-semibold">
                    Rp {order.totalPrice.toLocaleString("id-ID")}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 font-medium">
            NO ORDERS FOUND IN THIS STATUS
          </p>
        )}
      </div>
    </div>
  );
}

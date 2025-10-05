"use client";

import Loading from "@/components/Loading";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePickupOrders } from "../../_hooks/usePickupOrders";
import { Button } from "@/components/ui/button";

export default function PickupOrdersList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page") ?? 1);
  const [page, setPage] = useState(initialPage);
  const limit = 10;

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    router.replace(`/outlet-admin/orders/pick-up?${params.toString()}`);
  }, [page, router]);

  const { data, isLoading, isError } = usePickupOrders(page, limit);

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-red-500">Terjadi error saat ambil pickup orders.</p>;

  const pickupOrders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="PICKUP ORDER REQUESTS"
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Total Invoice</TableHead>
              <TableHead>Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pickupOrders.length > 0 ? (
              pickupOrders.map((pickup) => (
                <TableRow
                  key={pickup.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(`/outlet-admin/orders/pick-up/${pickup.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {pickup.customer?.name ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pickup.status === "RECEIVED_BY_OUTLET"
                          ? "secondary"
                          : pickup.status === "CANCELLED"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {pickup.status.replaceAll("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">{pickup.outlet?.name ?? "-"}</TableCell>
                  <TableCell>{pickup.orderHeaders?.length ?? 0}</TableCell>
                  <TableCell>
                    {new Date(pickup.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 font-medium"
                >
                  NO PICKUP ORDERS FOUND
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            variant="outline"
          >
            Prev
          </Button>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

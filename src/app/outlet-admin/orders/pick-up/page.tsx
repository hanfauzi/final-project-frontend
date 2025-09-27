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
import { useRouter } from "next/navigation";
import { usePickupOrders } from "../../_hooks/useOrdersOutletAdmin";


export default function PickupOrdersList() {
  const { data, isLoading, isError } = usePickupOrders();
  const router = useRouter();

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Terjadi error</p>;

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((pickup: any) => (
                <TableRow
                  key={pickup.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(`/outlet-admin/orders/pick-up/${pickup.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {pickup.customer.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pickup.status === "completed"
                          ? "secondary"
                          : pickup.status === "cancelled"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {pickup.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{pickup.outlet.name}</TableCell>
                  <TableCell>{pickup.orderHeaders.length}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 font-medium"
                >
                  NO PICKUP ORDERS FOUND
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import Loading from "@/components/Loading";
import { usePickupOrders } from "../../_hooks/useOrdersOutletAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function PickupOrdersList() {
  const { data, isLoading, isError } = usePickupOrders();
  const router = useRouter();

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Terjadi error</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Pick Up Orders</h1>

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

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePickupOrders } from "../../_hooks/useOrdersOutletAdmin";

export default function PickupOrdersList() {
  const { data, isLoading, isError } = usePickupOrders();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Terjadi error</p>;

  return (
    <div className="grid gap-4">
        <h1 className="text-xl font-bold mb-4">Pick Up Orders</h1>
      {data?.map((pickup: any) => (
        <Link
          key={pickup.id}
          href={`/outlet-admin/orders/pick-up/${pickup.id}`}
          className="block"
        >
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{pickup.customer.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex space-y-1 gap-x-2">
                <div className="flex flex-col space-y-3">
            <p>Status:</p>
            <p>Outlet:</p>
            <p>Total Invoice:</p>
        </div>
        <div className="flex flex-col space-y-3">
            <p>{pickup.status}</p>
            <p>{pickup.outlet.name}</p>
            <p>{pickup.orderHeaders.length}</p>
        </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

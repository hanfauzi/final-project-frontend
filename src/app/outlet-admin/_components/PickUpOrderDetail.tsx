"use client";

import { useParams } from "next/navigation";
import { usePickupOrderDetail } from "../_hooks/usePickupOrders";
import CreateOrderForm from "./CreateOrderForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function PickupOrderDetailPage() {
  const params = useParams<{ pickupOrderId: string }>();
  const pickupOrderId = params.pickupOrderId;

  const { data, isLoading, error } = usePickupOrderDetail(pickupOrderId);

  if (isLoading) return <p>Loading pickup order...</p>;
  if (error) return <p className="text-red-500">Failed to load pickup order</p>;
  if (!data) return <p>Pickup order not found</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Pickup Order Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer</p>
              <p className="font-semibold">{data.customer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="font-semibold">{data.customer.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outlet</p>
              <p className="font-semibold">{data.outlet.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="font-semibold">{data.status}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="font-semibold">{data.notes ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create order form */}
      <CreateOrderForm pickupOrderId={pickupOrderId} />
    </div>
  );
}

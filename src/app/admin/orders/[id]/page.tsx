"use client";

import { useParams } from "next/navigation";
import OrderDetail from "@/components/OrderDetail";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Order ID tidak valid</p>;

  return (
    <div className="p-4">
      <OrderDetail orderId={id} />
    </div>
  );
}

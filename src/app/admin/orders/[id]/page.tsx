"use client"
import OrderDetail from "@/components/OrderDetail";

export default function Page({ params }: { params: { id: string } }) {
  return <OrderDetail orderId={params.id} />;
}

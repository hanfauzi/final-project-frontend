"use client";

import { useParams } from "next/navigation";
import OrderDetail from "../../../../components/OrderDetail";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;
  
console.log("orderId:", orderId);
  return (
    <div className="p-4">
      <OrderDetail orderId={orderId as string} />
    </div>
  );
}

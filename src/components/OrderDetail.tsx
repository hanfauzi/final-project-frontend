"use client";

import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderDetail } from "../app/outlet-admin/_hooks/useOrdersOutletAdmin";
import { OrderItemType } from "@/types/orderItem";
import Countdown from "../app/outlet-admin/_components/Countdown";
import { OrderHeader } from "@/types/orderHeader";
import { Customer } from "@/types/customer";
import { Outlet } from "@/types/outlet";
import { WorkerTask } from "@/types/workerTasks";

interface OrderDetailProps {
  orderId: string;
}

const OrderInfo: FC<{ order: OrderHeader }> = ({ order }) => (
  <Card>
    <CardContent className="flex items-start gap-x-2">
      {/* Kiri: Judul */}
      <div className="flex flex-col space-y-2 font-semibold">
        <h3 className="font-semibold text-lg">Invoice:</h3>
        <h3 className="font-semibold text-lg">Status:</h3>
        <h3 className="font-semibold text-lg">Tanggal dibuat:</h3>
        <h3 className="font-semibold text-lg">Estimasi:</h3>
      </div>

      {/* Kanan: Informasi */}
      <div className="flex flex-col space-y-3">
        <p>{order.invoiceNo}</p>
        <p>
          <Badge>{order.status}</Badge>
        </p>
        <p>{new Date(order.createdAt).toLocaleString()}</p>
        <p>
          {order.estHours ? (
            <Badge>
              <Countdown
                estimatedDoneAt={
                  new Date(
                    new Date(order.createdAt).getTime() +
                      order.estHours * 60 * 60 * 1000
                  )
                }
              />
            </Badge>
          ) : (
            <Badge>{order.estHours} JAM</Badge>
          )}
        </p>
      </div>
    </CardContent>
  </Card>
);

const CustomerInfo: FC<{ customer: Customer }> = ({ customer }) => (
  <Card>
    <CardHeader>
      <CardTitle>Customer</CardTitle>
    </CardHeader>
    <CardContent className="flex space-y-1 gap-x-2">
      <div className="flex flex-col space-y-3">
        <p>Nama:</p>
        <p>Telepon:</p>
      </div>
      <div className="flex flex-col space-y-3">
        <p>{customer?.name || "-"}</p>
        <p>{customer?.phoneNumber || "-"}</p>
      </div>
    </CardContent>
  </Card>
);

const OutletInfo: FC<{ outlet: Outlet }> = ({ outlet }) => (
  <Card>
    <CardHeader>
      <CardTitle>Outlet</CardTitle>
    </CardHeader>
    <CardContent className="flex gap-x-2 space-y-1">
      <div className="flex flex-col space-y-3">
        <p>Nama:</p>
        <p>Alamat:</p>
        <p>Telepon:</p>
      </div>
      <div className="flex flex-col space-y-3">
        <p>{outlet?.name || "-"}</p>
        <p>{outlet?.address || "-"}</p>
        <p>{outlet?.phoneNumber || "-"}</p>
      </div>
    </CardContent>
  </Card>
);

const WorkerTasks: FC<{ tasks: WorkerTask[] }> = ({ tasks }) => (
  <Card>
    <CardHeader>
      <CardTitle>Karyawan yang mengerjakan</CardTitle>
    </CardHeader>
    <CardContent>
      {tasks?.length ? (
        <div className="space-y-10">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border-b border-gray-200 pb-3 space-y-1"
            >
              <div className="flex">
                <p className="font-medium w-20">Nama:</p>
                <p>{task.employee?.name || "-"}</p>
              </div>
              <div className="flex">
                <p className="font-medium w-20">Station:</p>
                <p>{task?.station || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>-</p>
      )}
    </CardContent>
  </Card>
);



const LaundryItemsTable: FC<{ orderItems: OrderItemType[] }> = ({
  orderItems,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Laundry Items</CardTitle>
    </CardHeader>
    <CardContent>
      {orderItems?.length ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-3">Service</th>
              <th className="py-2 px-3">Laundry Item</th>
              <th className="py-2 px-3">Qty</th>
              <th className="py-2 px-3">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) =>
              item.orderItemLaundry?.length ? (
                item.orderItemLaundry.map((laundry) => (
                  <tr key={laundry.id} className="border-b border-gray-200">
                    <td className="py-2 px-3">{item.service?.name || "-"}</td>
                    <td className="py-2 px-3">
                      {laundry.laundryItem?.name || "-"}
                    </td>
                    <td className="py-2 px-3">{laundry.qty}</td>
                    <td className="py-2 px-3">{item.note || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 px-3">{item.service?.name || "-"}</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">
                    {item.unitPrice ? "Rp" + item.unitPrice : "-"}
                  </td>
                  <td className="py-2 px-3">{item.note || "-"}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <p>-</p>
      )}
    </CardContent>
  </Card>
);

const OrderDetail: FC<OrderDetailProps> = ({ orderId }) => {
  const { data: order, isLoading, isError } = useOrderDetail(orderId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !order) return <p>Order tidak ditemukan.</p>;

  return (
    <div className="space-y-4">
      <OrderInfo order={order} />
      <LaundryItemsTable orderItems={order.OrderItem} />
      <WorkerTasks tasks={order.workerTasks} />
      <CustomerInfo customer={order.customers} />
      <OutletInfo outlet={order.outlets} />
    </div>
  );
};

export default OrderDetail;

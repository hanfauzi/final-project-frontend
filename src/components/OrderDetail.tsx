"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@/types/customer";
import { OrderHeader } from "@/types/orderHeader";
import { OrderItemType } from "@/types/orderItem";
import { Outlet } from "@/types/outlet";
import { WorkerTask } from "@/types/workerTasks";
import { FC } from "react";
import Countdown from "../app/outlet-admin/_components/Countdown";
import { useOrderDetail } from "../app/outlet-admin/_hooks/useOrdersOutletAdmin";

interface OrderDetailProps {
  orderId: string;
}

const OrderInfo: FC<{ order: OrderHeader }> = ({ order }) => (
  <Card>
    <CardHeader>
      <CardTitle>Order Info</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Kiri: Info Umum */}
      <div className="flex flex-col space-y-3">
        <div className="flex">
          <p className="font-medium w-40">Invoice:</p>
          <p>{order.invoiceNo}</p>
        </div>
        <div className="flex">
          <p className="font-medium w-40">Status:</p>
          <Badge>{order.status}</Badge>
        </div>
        <div className="flex">
          <p className="font-medium w-40">Tanggal dibuat:</p>
          <p>{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex">
          <p className="font-medium w-40">Estimasi:</p>
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
        </div>
      </div>

      {/* Kanan: Total2 */}
      <div className="flex flex-col space-y-3">
        <div className="flex ">
          <p className="font-medium w-40">Items Total:</p>
          <p>Rp {order.itemsTotal?.toLocaleString() ?? 0}</p>
        </div>
        <div className="flex">
          <p className="font-medium w-40">Pickup Price:</p>
          <p>Rp {order.pickupPrice?.toLocaleString() ?? 0}</p>
        </div>
        <div className="flex">
          <p className="font-medium w-40">Total:</p>
          <b>Rp {order.total?.toLocaleString() ?? 0}</b>
        </div>
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
        <div className="space-y-4 gap-10">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border-b border-gray-200 pb-3 space-y-1"
            >
              <div className="flex">
                <p className="font-medium w-20">Nama:</p>
                <p>{task.employee?.name || "-"}</p>
              </div>
              <div className="flex py-2">
                <p className="font-medium w-20">Station:</p>
                <p>{task?.station || "-"}</p>
              </div>
              <div className="flex">
                <p className="font-medium w-20">catatan:</p>
                <p>{task?.itemPassedNote || "-"}</p>
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
        <div className="overflow-x-auto">
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
        </div>
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

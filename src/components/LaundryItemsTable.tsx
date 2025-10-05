"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItemType } from "@/types/orderItem";
import { FC } from "react";

const LaundryItemsTable: FC<{ orderItems: OrderItemType[] }> = ({ orderItems }) => (
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

export default LaundryItemsTable;

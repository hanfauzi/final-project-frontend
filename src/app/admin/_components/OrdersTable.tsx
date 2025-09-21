"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  customers?: { name?: string };
  outlets?: { name?: string };
  createdAt: string;
}

interface Meta {
  total: number;
}

interface OrdersTableProps {
  data: Order[] | undefined;
  meta: Meta | undefined;
}

const OrdersTable: FC<OrdersTableProps> = ({ data, meta }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customers?.name ?? "-"}</TableCell>
              <TableCell>{order.outlets?.name ?? "-"}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="text-sm text-gray-500 mt-2">
        Showing {data?.length ?? 0} of {meta?.total ?? 0} orders
      </div>
    </>
  );
};

export default OrdersTable;

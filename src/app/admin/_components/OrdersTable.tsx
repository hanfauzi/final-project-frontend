"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface Order {
  id: string;
  invoiceNo: string;
  status: string;
  totalPrice: number;
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
  const router = useRouter();
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
            >
              <TableCell className="py-4">{order.invoiceNo}</TableCell>
              <TableCell className="py-4">
                {order.customers?.name ?? "-"}
              </TableCell>
              <TableCell className="py-4">
                {order.outlets?.name ?? "-"}
              </TableCell>
              <TableCell className="py-4">
                <Badge
                      variant={
                        order.status === "ARRIVED_AT_OUTLET"
                          ? "secondary"
                          : order.status === "COMPLETED"
                          ? "outline"
                          : "default"
                      }
                    >
                      {order.status.replaceAll("_", " ").toUpperCase()}
                    </Badge>
              </TableCell>
              <TableCell className="py-4">{new Date(order.createdAt).toLocaleDateString("id-ID")}</TableCell>
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

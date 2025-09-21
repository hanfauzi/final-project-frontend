"use client";

import { FC, useState } from "react";
import { useOrders } from "@/app/admin/_hooks/useOrders";
import { useOutlets } from "@/app/admin/_hooks/useOutlets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/Loading";
import OrdersFilter from "./OrdersFilter";
import OrdersTable from "./OrdersTable";

const GetAllOrders: FC = () => {
  const [outletId, setOutletId] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useOrders({
    page: 1,
    limit: 10,
    outletId,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    data: outlets,
    isLoading: isOutletsLoading,
    isError: isOutletsError,
  } = useOutlets();

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Failed to load orders</p>;

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrdersFilter
            outlets={outlets}
            isOutletsLoading={isOutletsLoading}
            isOutletsError={isOutletsError}
            outletId={outletId}
            onOutletChange={setOutletId}
            onApply={() => refetch()}
            isApplying={isLoading}
          />

          <OrdersTable data={data?.data} meta={data?.meta} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GetAllOrders;

"use client";

import { FC } from "react";
import { useOrders } from "@/app/admin/_hooks/useOrders";
import { useOutlets } from "@/app/admin/_hooks/useOutlets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/Loading";
import OrdersFilter from "./OrdersFilter";
import OrdersTable from "./OrdersTable";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

const GetAllOrders: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil state dari URL
  const outletId = searchParams.get("outletId") || undefined;
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError, refetch } = useOrders({
    page: currentPage,
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

  
  const updateSearchParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.replace(`?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: String(page) });
  };

  const handleOutletChange = (id: string | undefined) => {
    updateSearchParams({ outletId: id, page: "1" }); 
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Failed to load orders</p>;

  return (
    <div className="px-2 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrdersFilter
            outlets={outlets}
            isOutletsLoading={isOutletsLoading}
            isOutletsError={isOutletsError}
            outletId={outletId}
            onOutletChange={handleOutletChange}
            onApply={() => refetch()}
            isApplying={isLoading}
          />

          <OrdersTable data={data?.data} meta={data?.meta} />
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </Button>

        <span>
          Page {currentPage} of {data?.meta?.totalPages || 1}
        </span>

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data?.meta?.totalPages || data?.meta?.totalPages === 0}
          className="px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default GetAllOrders;

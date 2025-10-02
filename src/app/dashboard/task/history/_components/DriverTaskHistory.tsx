"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersList from "../../_components/OrderList";
import useGetPickUpOrdersByDriver from "../../_hooks/useGetPickUpOrdersByDriver";
import useGetDeliveryOrdersByDriver from "../../_hooks/useGetDeliveryOrdersByDriver";
import { useEmployee } from "@/app/dashboard/_context/EmployeeContext";
import { useState } from "react";
import PaginationSection from "@/components/PaginationSection";
import { DateRangePicker } from "@/components/DateRangePicker";

export default function DriverTaskHistory() {
  const { employee, } = useEmployee();

  const [pickUpOrderPage, setPickUpOrderPage] = useState(1);
  const handlePickUpDateChange = (date: { from: string; to: string }) => {
    if (date.from !== pickUpDateRange?.from || date.to !== pickUpDateRange?.to) {
      setPickUpDateRange(date);
      setPickUpOrderPage(1);
    }
  };
  const [pickUpDateRange, setPickUpDateRange] = useState<{
    from: string;
    to: string;
  } | null>(null);
  
  const [deliveryOrderPage, setDeliveryOrderPage] = useState(1);
  const handleDeliveryDateChange = (date: { from: string; to: string }) => {
    if (date.from !== deliveryDateRange?.from || date.to !== deliveryDateRange?.to) {
      setDeliveryDateRange(date);
      setPickUpOrderPage(1);
    }
  };
  const [deliveryDateRange, setDeliveryDateRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const {
    data: pickUpOrders,
    isLoading: pickUpOrdersLoading,
    isError: pickUpOrdersError,
    error: pickUpOrdersErrorObj,
  } = useGetPickUpOrdersByDriver({
    query: { 
      mode: "HISTORY", 
      page: pickUpOrderPage, 
      take: 10,
      fromDate: pickUpDateRange?.from,
      toDate: pickUpDateRange?.to,
    },
    activeInterval: false,
    inactiveInterval: false,
  });

  const {
    data: deliveryOrders,
    isLoading: deliveryOrdersLoading,
    isError: deliveryOrdersError,
    error: deliveryOrdersErrorObj,
  } = useGetDeliveryOrdersByDriver({
    query: { 
      mode: "HISTORY", 
      page: deliveryOrderPage, 
      take: 10,
      fromDate: deliveryDateRange?.from,
      toDate: deliveryDateRange?.to, 
    },
    activeInterval: false,
    inactiveInterval: false,
  });

  return (
    <div className="flex flex-col gap-4 pb-14">
      <div>
        <h1>Hello, <span className="font-bold">{employee?.name ?? "User"}</span></h1>
        <h2>This is your task history</h2>
      </div>
      
      <Tabs defaultValue="pickup">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">Task History</div>
            <TabsList className="bg-foreground/5">
              <TabsTrigger value="pickup"
                className="data-[state=active]:bg-primary data-[state=active]:text-white hover:cursor-pointer"
              >
                Pickup
              </TabsTrigger>
              <TabsTrigger value="delivery"
                className="data-[state=active]:bg-primary data-[state=active]:text-white hover:cursor-pointer"
              >
                Delivery
              </TabsTrigger>
            </TabsList>
          </div>
        <TabsContent value="pickup">
          <div className="flex flex-col gap-4">
            <DateRangePicker
              value={pickUpDateRange}
              onChange={handlePickUpDateChange}
            />
            <OrdersList
              orders={pickUpOrders?.data ?? []}
              isLoading={pickUpOrdersLoading}
              isError={pickUpOrdersError}
              error={pickUpOrdersErrorObj as Error | null}
              basePath="/dashboard/task/pickup-order/"
              emptyMessage="No pick-up history available"
            />
            {pickUpOrders?.meta && (
              <div className="flex justify-center">
                <div>
                  <PaginationSection meta={pickUpOrders.meta} setPage={setPickUpOrderPage} />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="delivery">
          <div className="flex flex-col gap-4">
            <DateRangePicker
              value={deliveryDateRange}
              onChange={handleDeliveryDateChange}
            />
            <OrdersList
              orders={deliveryOrders?.data ?? []}
              isLoading={deliveryOrdersLoading}
              isError={deliveryOrdersError}
              error={deliveryOrdersErrorObj as Error | null}
              basePath="/dashboard/task/delivery-order/"
              emptyMessage="No delivery history available"
            />
            {deliveryOrders?.meta && (
              <div className="flex justify-center">
                <div>
                  <PaginationSection meta={deliveryOrders.meta} setPage={setDeliveryOrderPage} />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
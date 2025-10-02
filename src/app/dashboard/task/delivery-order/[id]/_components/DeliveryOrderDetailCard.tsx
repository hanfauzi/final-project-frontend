"use client";

import { DeliveryOrder } from "@/types/deliveryOrder";
import { format } from "date-fns";
import { Copy, MapPinned } from "lucide-react";
import { useState } from "react";

type DeliveryOrderDetailCardProps = {
  deliveryOrder: DeliveryOrder;
};

export default function DeliveryOrderDetailCard({ deliveryOrder }: DeliveryOrderDetailCardProps) {
  const handleOpenMap = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(deliveryOrder.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-card border-1 rounded-md p-3">
      <div className="flex flex-col items-center gap-4 text-sm">
        <div className="flex justify-center gap-1 w-full">
          <div className="overflow-hidden max-w-8/12">
            <div className="text-primary text-xl font-bold whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:overflow-x-auto">
              {deliveryOrder.id}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="max-w-1/12 h-fit text-gray-600 p-1 hover:text-gray-800 hover:cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? <Copy size={18} className="text-blue-300" /> : <Copy size={18} />}
          </button>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between">
            <div className="flex-5/12 font-semibold">Request Date</div>
            <div className="flex-7/12 text-right">
              {deliveryOrder.createdAt
                ? format(new Date(deliveryOrder.createdAt), "EEE, dd MMMM yyyy")
                : "N/A"}
            </div>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex-5/12 font-semibold">Assigned By</div>
            <div className="flex-7/12 text-right overflow-hidden">
              <div className="whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:overflow-x-auto">
                {deliveryOrder.assignedByAdmin?.name ?? "-"}
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex-5/12 font-semibold">Customer Name</div>
            <div className="flex-7/12 text-right">
              {deliveryOrder.orderHeader?.customers?.name}
            </div>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex-5/12 font-semibold">Phone Number</div>
            <div className="flex-7/12 text-right">
              {deliveryOrder.customerAddress?.phoneNumber}
            </div>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex-5/12 font-semibold">Driver</div>
            <div className="flex-7/12 text-right">
              {deliveryOrder.driver?.name ? (
                  deliveryOrder.driver.name
                ) : (
                  <span className='text-red-500 font-semibold'>No assigned driver</span>
                )}
            </div>
          </div>
        </div>

        <div className="relative flex w-full items-center py-1">
          <div className="flex-grow border-t-2 border-primary"></div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <div className="font-semibold">Customer Address</div>
              <button
                className="hover:cursor-pointer"
                onClick={() => {
                  if (deliveryOrder.customerAddress?.latitude && deliveryOrder.customerAddress?.longitude) {
                    handleOpenMap({
                      latitude: deliveryOrder.customerAddress.latitude,
                      longitude: deliveryOrder.customerAddress.longitude,
                    });
                  } else {
                    alert("No location available for this address");
                  }
                }}
              >
                <MapPinned className="text-primary" />
              </button>
            </div>
            <div>{deliveryOrder.customerAddress?.address}</div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between w-full">
              <div className="font-semibold">Outlet Address</div>
              <button
                className="hover:cursor-pointer"
                onClick={() => {
                  if (deliveryOrder.outlet?.latitude && deliveryOrder.outlet?.longitude) {
                    handleOpenMap({
                      latitude: deliveryOrder.outlet.latitude,
                      longitude: deliveryOrder.outlet.longitude,
                    });
                  } else {
                    alert("No location available for this address");
                  }
                }}
              >
                <MapPinned className="text-primary" />
              </button>
            </div>
            <div>{deliveryOrder.outlet?.address}</div>
          </div>

          <div className="flex justify-between w-full">
            <div className="font-semibold">Distance</div>
            <div>{deliveryOrder.distance} m</div>
          </div>
        </div>

        <div className="relative flex w-full items-center py-1">
          <div className="flex-grow border-t-2 border-primary"></div>
        </div>

        <div className="flex justify-between w-full">
          <div className="flex-5/12 font-semibold">Price</div>
          <div className="flex-7/12 text-right">{deliveryOrder.price}</div>
        </div>

        <div className="bg-muted p-1 w-full rounded-md border-1 border-border">
          <div className="text-center font-semibold">{deliveryOrder.status}</div>
        </div>
      </div>
    </div>
  );
}

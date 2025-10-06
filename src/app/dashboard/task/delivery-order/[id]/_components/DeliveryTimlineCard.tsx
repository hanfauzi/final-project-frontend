"use client";

import { DeliveryOrder } from "@/types/deliveryOrder";
import { format } from "date-fns";
import { Check, ChevronDown } from "lucide-react";

type DeliveryTimelineCardProps = {
  deliveryOrder: DeliveryOrder;
};

export default function DeliveryTimelineCard({ deliveryOrder }: DeliveryTimelineCardProps) {

  return (
    <div className="collapse bg-card border-1 rounded-md">
      <input type="checkbox" />
      <div className="collapse-title font-semibold flex justify-between gap-2 px-4">
        <div>Delivery Timeline</div>
        <ChevronDown />
      </div>
      <div className="collapse-content text-sm">
        <ul className="relative ml-4 border-l-2 border-gray-300 flex flex-col justify-center">
          {deliveryOrder.deliveredAt && (
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(deliveryOrder.deliveredAt), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(deliveryOrder.deliveredAt), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">Delivered To The Customer</div>
              </div>
            </li>
          )}
          {deliveryOrder.takenByDriverAt && (
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(deliveryOrder.takenByDriverAt), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(deliveryOrder.takenByDriverAt), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">Picked Up By Driver</div>
              </div>
            </li>
          )}
          {deliveryOrder.assignByDriverAt && (
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(deliveryOrder.assignByDriverAt), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(deliveryOrder.assignByDriverAt), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">Assigned To Driver</div>
              </div>
            </li>
          )}
          {deliveryOrder.createdAt && (
            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(deliveryOrder.createdAt), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(deliveryOrder.createdAt), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">Delivery Order Requested</div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

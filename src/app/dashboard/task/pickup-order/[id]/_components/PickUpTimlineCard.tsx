"use client";

import { PickUpOrder } from "@/types/pickUpOrder";
import { format } from "date-fns";
import { Check, ChevronDown } from "lucide-react";

type PickUpTimelineCardProps = {
  pickUpOrder: PickUpOrder;
};

export default function PickUpTimelineCard({ pickUpOrder }: PickUpTimelineCardProps) {

  return (
    <div className="collapse bg-card border-1 rounded-md">
      <input type="checkbox" />
      <div className="collapse-title font-semibold flex justify-between gap-2 px-4">
        <div>Pick-up Timeline</div>
        <ChevronDown />
      </div>
      <div className="collapse-content text-sm">
        <ul className="relative ml-4 border-l-2 border-gray-300 flex flex-col justify-center">
          {pickUpOrder.arrivedAtOutlet && (
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(pickUpOrder.arrivedAtOutlet), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(pickUpOrder.arrivedAtOutlet), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">Arrived At Outlet</div>
              </div>
            </li>
          )}
          {pickUpOrder.pickedUpAt && (
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(pickUpOrder.pickedUpAt), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(pickUpOrder.pickedUpAt), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">Picked Up By Driver</div>
              </div>
            </li>
          )}
          {pickUpOrder.assignByDriverAt && (
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(pickUpOrder.assignByDriverAt), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(pickUpOrder.assignByDriverAt), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">On The Way To Customer</div>
              </div>
            </li>
          )}
          {pickUpOrder.createdAt && (
            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-white" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div>{format(new Date(pickUpOrder.createdAt), "EEE, dd MMMM yyyy")}</div>
                  <div>{format(new Date(pickUpOrder.createdAt), "HH:mm")}</div>
                </div>
                <div className="font-semibold text-[16px]">Pick-up Order Requested</div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

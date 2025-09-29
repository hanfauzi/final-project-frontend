"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";

interface Outlet {
  id: string;
  name: string;
}

interface OrdersFilterProps {
  outlets: Outlet[] | undefined;
  isOutletsLoading: boolean;
  isOutletsError: boolean;
  outletId: string | undefined;
  onOutletChange: (val: string | undefined) => void;
  onApply: () => void;
  isApplying: boolean;
}

const OrdersFilter: FC<OrdersFilterProps> = ({
  outlets,
  isOutletsLoading,
  isOutletsError,
  outletId,
  onOutletChange,
}) => {
  return (
    <div className="flex items-center gap-4">
      <Select
        onValueChange={(val) => onOutletChange(val === "all" ? undefined : val)}
        value={outletId ?? "all"}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Outlet" />
        </SelectTrigger>
        <SelectContent>
          {isOutletsLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : isOutletsError ? (
            <SelectItem value="error" disabled>
              Failed to load outlets
            </SelectItem>
          ) : (
            <>
              <SelectItem value="all">All Outlets</SelectItem>
              {outlets?.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrdersFilter;

"use client";

import { FC } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  onApply,
  isApplying,
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

      <Button
        variant="secondary"
        onClick={onApply}
        disabled={isApplying}
      >
        Apply Filter
      </Button>
    </div>
  );
};

export default OrdersFilter;

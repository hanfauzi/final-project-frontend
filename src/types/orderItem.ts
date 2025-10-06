export interface LaundryItemType {
  id: string;
  qty: number;
  laundryItem: {
    id: string;
    name: string;
  } | null;
}

export interface OrderItemType {
  id: string;
  service: {
    id: string;
    name: string;
    unit: string;
  } | null;
  qty: number;
  unitPrice?: number;
  note?: string;
  orderItemLaundry?: LaundryItemType[];
}
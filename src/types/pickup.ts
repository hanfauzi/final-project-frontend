// src/types/pickup.ts
export interface LaundryItem {
  id: string;
  name: string;
}

export interface PickupOrder {
  id: string;
  customerId?: string;
  outletId: string;
  notes?: string;
  services: string[]; 

}

// interface untuk orderItem formik
export interface OrderItemForm {
  serviceId: string;
  qty: number;
  unitPrice?: number;
  note?: string;
  laundryItems: LaundryItemForm[];
}

export interface LaundryItemForm {
  laundryItemId: string;
  qty: number;
}

// formik initial values
export interface CreateOrderFormValues {
  pickupOrderId: string;
  notes?: string;
  items: OrderItemForm[];
}

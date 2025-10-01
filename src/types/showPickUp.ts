export type PickupStatus =
  | "WAITING_FOR_DRIVER"
  | "ON_THE_WAY_TO_CUSTOMER"
  | "ON_THE_WAY_TO_OUTLET"
  | "RECEIVED_BY_OUTLET"
  | "CANCELLED";


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Outlet {
  id: string;
  name: string;
}

export interface OrderHeader {
  id: string;
  invoiceNo: string;
  totalAmount?: number;
  createdAt: string;
}

export interface PickupOrder {
  id: string;
  customerId?: string | null;
  outletId: string;
  status: PickupStatus;  
  createdAt: string;

  customer?: Customer | null;
  outlet: Outlet;
  orderHeaders: OrderHeader[];
}

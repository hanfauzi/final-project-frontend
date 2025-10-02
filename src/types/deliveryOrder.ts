import { CustomerAddress } from "./customerAddress";
import { Employee } from "./employee";
import { OrderHeader } from "./orderHeader";
import { Outlet } from "./outlet";

export interface DeliveryOrder {
  id: string;
  status: DeliveryOrderStatus;
  distance: number;
  price: number;

  takenByDriverAt: string | null;
  deliveredAt: string | null;

  createdAt: string;

  driver?: Employee;
  outlet?: Outlet;
  customerAddress?: CustomerAddress;
  assignedByAdmin?: Employee;
  orderHeader?: OrderHeader;
}

export enum DeliveryOrderStatus {
  NOT_READY_TO_DELIVER = "NOT_READY_TO_DELIVER",
  WAITING_FOR_DRIVER = "WAITING_FOR_DRIVER",
  ON_THE_WAY_TO_OUTLET = "ON_THE_WAY_TO_OUTLET",
  ON_THE_WAY_TO_CUSTOMER = "ON_THE_WAY_TO_CUSTOMER",
  RECEIVED_BY_CUSTOMER = "RECEIVED_BY_CUSTOMER",
}
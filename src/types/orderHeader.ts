import { Customer } from "./customer";
import { Employee } from "./employee";
import { OrderItemType } from "./orderItem";
import { OrderStatus } from "./orderStatus";
import { Outlet } from "./outlet";

export interface OrderHeader {
  id: string;
  customerId: string;
  status: OrderStatus;
  notes: string;
  estHours: number;
  invoiceNo: string;
  itemsTotal?: number;
  pickupPrice?: number;
  total?: number;

  createdAt: string;
  
  customers?: Customer
  handledByAdmin?: Employee
  outlets?: Outlet
  OrderItem?: OrderItemType[]
}

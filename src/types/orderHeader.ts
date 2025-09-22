import { Customer } from "./customer";
import { Employee } from "./employee";
import { OrderStatus } from "./orderStatus";
import { Outlet } from "./outlet";

export interface OrderHeader {
  id: string;
  customerId: string;
  status: OrderStatus;
  notes: string;
  estHour: number;

  createdAt: string;
  
  customers?: Customer
  handledByAdmin?: Employee
  outlet?: Outlet
}

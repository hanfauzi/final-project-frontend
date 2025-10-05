import { Customer } from "./customer";
import { CustomerAddress } from "./customerAddress";
import { Employee } from "./employee";
import { Outlet } from "./outlet";

export interface PickUpOrder {
  id: string;
  status: PickUpOrderStatus;
  distance: number;
  price: number;
  assignByDriverAt: string | null;
  pickedUpAt: string | null;
  arrivedAtOutlet: string | null;
  services: string[]; 

  createdAt: string;

  driver?: Employee;
  outlet?: Outlet;
  customer?: Customer;
  customerAddress?: CustomerAddress;
  assignedByAdmin?: Employee;
}

export enum PickUpOrderStatus {
  WAITING_FOR_DRIVER = "WAITING_FOR_DRIVER",
  ON_THE_WAY_TO_CUSTOMER = "ON_THE_WAY_TO_CUSTOMER",
  ON_THE_WAY_TO_OUTLET = "ON_THE_WAY_TO_OUTLET",
  RECEIVED_BY_OUTLET = "RECEIVED_BY_OUTLET",
}
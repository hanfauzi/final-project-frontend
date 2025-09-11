import { OrderStatus } from "./orderStatus";
export type OutletLite = {
  name: string;
};
export type CustomerOrder = {
  id: string;
  customerId: string;
  handledById: string | null;
  outletId: string;
  status: OrderStatus;
  notes: string | null;
  estHours: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  outlets: OutletLite | null;
};

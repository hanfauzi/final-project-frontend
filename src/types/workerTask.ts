import { CustomerAddress } from "./customerAddress";
import { Employee } from "./employee";
import { OrderHeader } from "./orderHeader";
import { Outlet } from "./outlet";

export interface WorkerTask {
  id: string;
  status: WorkerTaskStatus;
  isBypassRequired: boolean;
  bypassReq: boolean;
  bypassReqNote?: string;
  isReqAprooved: boolean;
  itemPassedNote?: string;
  station: WorkerStation;

  createdAt: string;

  employee?: Employee;
  outlet?: Outlet;
  customerAddress?: CustomerAddress;
  assignedByAdminId?: Employee;
  orderHeader?: OrderHeader;
}

export enum WorkerTaskStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  REQUEST_BYPASS = "REQUEST_BYPASS",

}

export enum WorkerStation {
  WASHING = "WASHING",
  IRONING = "IRONING",
  PACKING = "PACKING",
}
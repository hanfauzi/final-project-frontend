import { OrderItemType } from "./orderItem";

// enums
export enum TaskStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  REQUEST_BYPASS = "REQUEST_BYPASS",
}

// base interfaces
export interface Employee {
  id: string;
  name: string;
  email: string;
}

export interface OrderHeader {
  id: string;
  invoiceNo: string;
  OrderItem?: OrderItemType[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Outlet {
  id: string;
  name: string;
  address?: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string; 
  endTime: string;
}

export interface WorkStation {
  id: string;
  name: string;
  
}
export enum Station {
  WASHING = "WASHING",
  IRONING = "IRONING",
  PACKING = "PACKING",
  QA = "QA",
  ADMIN = "ADMIN",
}

// main interface
export interface WorkerTask {
  id: string;
  employeeId?: string;
  orderHeaderId: string;
  orderItemId?: string;
  outletId: string;
  shiftId?: string;
  workStationId?: string;
  station: Station;
  status: TaskStatus;
  itemQty?: number;
  itemUnit?: string;
  bypassReqNote?: string;
  bypassReq?: boolean;
  isReqAprooved?: boolean;
  itemPassedNote?: string;
  assignedById?: string;

  createdAt: string; // Prisma DateTime → string ISO
  updatedAt: string;
  deletedAt?: string;

  // relations
  employee: Employee;
  assignedBy?: Employee;
  orderHeader?: OrderHeader;
  orderItem?: OrderItem;
  outlet: Outlet;
  shift: Shift;
  workStation: WorkStation;
}

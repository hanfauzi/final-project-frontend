import { EmployeeRole } from "./roles";
import { Shift } from "./shift";

export interface Employee {
  id: string;
  name: string;
  email: string;
  outletId: string;
  shiftId: string;
  role: EmployeeRole;
  phoneNumber: string;
  address: string;
  photoUrl: string | null;

  shift?: Shift
}

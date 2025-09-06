import { EmployeeRole } from "./roles";

export interface Employee {
  
  id: string;
  email: string;
  role: EmployeeRole;
}

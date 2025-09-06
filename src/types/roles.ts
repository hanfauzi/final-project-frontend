export const EMPLOYEE_ROLES = [
  "super_admin",
  "outlet_admin",
  "driver",
  "worker",
] as const;

export type EmployeeRole = (typeof EMPLOYEE_ROLES)[number];

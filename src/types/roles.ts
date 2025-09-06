export const EMPLOYEE_ROLES = [
  "SUPER_ADMIN",
  "OUTLET_ADMIN",
  "DRIVER",
  "WORKER",
] as const;

export type EmployeeRole = (typeof EMPLOYEE_ROLES)[number];

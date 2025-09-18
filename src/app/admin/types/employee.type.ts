
export type EmployeeRole = "SUPER_ADMIN" | "OUTLET_ADMIN" | "DRIVER" | "WORKER";

export interface CreateEmployeeDTO {
  outletId: string;
  shiftId: string;
  role: EmployeeRole
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  photoUrl?: File;
  isActive?: boolean;
}

export type UpdateEmployeeDTO = Partial<CreateEmployeeDTO>;

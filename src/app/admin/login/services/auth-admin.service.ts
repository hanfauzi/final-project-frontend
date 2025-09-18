import { axiosInstance } from "@/lib/axios";

export interface LoginDto {
  email: string;
  password: string;
}

export interface AdminPayload {
  id: string;
  role: "SUPER_ADMIN" | "OUTLET_ADMIN";
  email: string;
  outletId?: string | null;
}

export interface AuthResponse {
  token: string;
  payload: AdminPayload;
}

export interface AuthApiResponse {
    message: string;
    data: AuthResponse
}

export const authAdminService = {
  superAdminLogin: async (dto: LoginDto) => {
    const res = await axiosInstance.post<AuthApiResponse>(
      "/api/auth/super-admin/login", 
      dto,
      { skipAuth: true, skipRedirect401: true }
    );
    return res.data.data;
  },

  outletAdminLogin: async (dto: LoginDto) => {
    const res = await axiosInstance.post<AuthApiResponse>(
      "/api/auth/outlet-admin/login", 
      dto,
      { skipAuth: true, skipRedirect401: true }
    );
    return res.data.data;
  },
};

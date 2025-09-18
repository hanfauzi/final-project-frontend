import type { Customer } from "@/types/customer";
import type { Employee } from "@/types/employee";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerStore extends Customer {
  token: string;
}
export interface EmployeeStore {
  id: string;
  role: "SUPER_ADMIN" | "OUTLET_ADMIN";
  email: string;
  outletId?: string | null;
  token: string;
}

type Principal = "CUSTOMER" | "EMPLOYEE" | null;

type Store = {
  customer: CustomerStore | null;
  employee: EmployeeStore | null;
  isHydrated: boolean;

  onCustomerAuthSuccess: (payload: { customer: CustomerStore }) => void;
  onEmployeeAuthSuccess: (payload: { employee: EmployeeStore }) => void;

  clearCustomer: () => void;
  clearEmployee: () => void;
  clearAuth: () => void;

  isLoggedIn: () => boolean;
  getToken: (prefer?: "customer" | "employee") => string | undefined;
  getPrincipal: () => Principal;

  setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<Store>()(
  persist(
    (set, get) => ({
      customer: null,
      employee: null,
      isHydrated: false,

      onCustomerAuthSuccess: ({ customer }) =>
        set({ customer: { ...customer } }),
      onEmployeeAuthSuccess: ({ employee }) =>
        set({ employee: { ...employee } }),

      clearCustomer: () => set({ customer: null }),
      clearEmployee: () => set({ employee: null }),
      clearAuth: () => set({ customer: null, employee: null }),

      isLoggedIn: () => !!(get().customer || get().employee),

      getToken: (prefer) => {
        if (prefer === "customer") return get().customer?.token;
        if (prefer === "employee") return get().employee?.token;
        return get().employee?.token ?? get().customer?.token;
      },

      getPrincipal: () => {
        if (get().employee) return "EMPLOYEE";
        if (get().customer) return "CUSTOMER";
        return null;
      },

      setHydrated: (v) => set({ isHydrated: v }),
    }),
    {
      name: "laundr-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated?.(true);
      },
    }
  )
);

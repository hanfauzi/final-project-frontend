import type { Customer } from "@/types/customer";
import { create } from "zustand";
import { persist /*, createJSONStorage*/ } from "zustand/middleware";

export interface CustomerStore extends Customer {
  token: string;
}

type Store = {
  customer: CustomerStore | null;
  onAuthSuccess: (payload: { customer: CustomerStore }) => void;
  clearAuth: () => void;

  // optional helpers
  isLoggedIn: () => boolean;
  getToken: () => string | undefined;
};

export const useAuthStore = create<Store>()(
  persist(
    (set, get) => ({
      customer: null,

      onAuthSuccess: ({ customer }) => {
        set({ customer: { ...customer } });
      },

      clearAuth: () => set({ customer: null }),

      // helpers
      isLoggedIn: () => !!get().customer,
      getToken: () => get().customer?.token,
    }),
    {
      name: "laundr-store",
      // ⚠️ pertimbangkan keamanan token:
      // storage: createJSONStorage(() => sessionStorage),
      // partialize: (s) => ({ customer: s.customer ? { ...s.customer, token: undefined as any } : null }),
    }
  )
);

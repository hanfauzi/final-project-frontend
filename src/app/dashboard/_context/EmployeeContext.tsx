"use client";

import { createContext, ReactNode, useContext } from "react";
import useGetEmployee from "../_hooks/useGetEmployee";
import { Employee } from "@/types/employee";

type EmployeeContextType = {
  employee: Employee | undefined;
  isLoading: boolean;
  error: Error | null;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const { data: employee, isLoading, error } = useGetEmployee();

  return (
    <EmployeeContext.Provider value={{ employee, isLoading, error }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployee must be used within an EmployeeProvider");
  }
  return context;
};

import { ReactNode } from "react";
import DashboardAdminLayout from "../admin/_components/DashboardAdminLayout";

export default function OutletAdminLayout({ children }: { children: ReactNode }) {
  return <DashboardAdminLayout>{children}</DashboardAdminLayout>;
}

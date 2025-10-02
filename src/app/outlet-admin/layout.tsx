import { ReactNode } from "react";
import DashboardAdminLayout from "../admin/_components/DashboardAdminLayout";
import ClientAuthGuard from "./ClientAuthGuard";

export default function OutletAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardAdminLayout>
      <ClientAuthGuard>{children}</ClientAuthGuard>
    </DashboardAdminLayout>
  );
}

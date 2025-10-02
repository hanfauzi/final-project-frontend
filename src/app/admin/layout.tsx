import DashboardAdminLayout from "./_components/DashboardAdminLayout";
import ClientAuthGuard from "./ClientAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAdminLayout>
      <ClientAuthGuard>{children}</ClientAuthGuard>
    </DashboardAdminLayout>
  );
}

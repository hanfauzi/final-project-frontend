"use client";

import { withAuthGuard } from "@/hoc/AuthGuard";

function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withAuthGuard(ClientAuthGuard, {
  principal: "EMPLOYEE",
  allowedEmployeeRoles: ["SUPER_ADMIN"],
  redirectToLoginEmployee: "/employee/login",
});

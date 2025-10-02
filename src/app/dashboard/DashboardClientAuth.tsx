"use client";

import { withAuthGuard } from "@/hoc/AuthGuard";

function PassThrough({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const Guarded = withAuthGuard(PassThrough, {
  principal: "EMPLOYEE",
  redirectToLoginEmployee: "/employee/login",
  superAdminCanAccessCustomer: true,
});

export default function DashboardClientAuth({ children }: { children: React.ReactNode }) {
  return <Guarded>{children}</Guarded>;
}

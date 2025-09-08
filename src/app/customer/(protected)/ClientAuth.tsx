"use client";

import { withAuthGuard } from "@/hoc/AuthGuard";

function PassThrough({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const Guarded = withAuthGuard(PassThrough, {
  principal: "CUSTOMER",
  redirectToLoginCustomer: "/customer/login",
  superAdminCanAccessCustomer: true,
});

export default function ClientAuth({ children }: { children: React.ReactNode }) {
  return <Guarded>{children}</Guarded>;
}

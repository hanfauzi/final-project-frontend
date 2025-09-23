"use client";

import { useAutoLogout } from "@/hooks/useAutoLogout";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useAutoLogout();
  return <>{children}</>;
}

"use client";

import { useAuthStore } from "@/stores/auth";
import { useEffect, useState, type ComponentType, type FC } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export type EmployeeRole = "super_admin" | "outlet_admin" | "driver" | "worker";
type PrincipalType = "customer" | "employee" | "any";

interface WithAuthOptions {
  requireAuth?: boolean;
  principal?: PrincipalType;
  allowedEmployeeRoles?: EmployeeRole[];
  allowCustomerWhenAny?: boolean;
  redirectToLoginCustomer?: string;
  redirectToLoginEmployee?: string;
  unauthorizedTo?: string;
  superAdminBypass?: boolean;
  superAdminCanAccessCustomer?: boolean;
}

export function withAuthGuard<P extends object>(
  Component: ComponentType<P>,
  opts: WithAuthOptions = {}
): ComponentType<P> {
  const {
    requireAuth = true,
    principal = "any",
    allowedEmployeeRoles = [],
    allowCustomerWhenAny = true,
    redirectToLoginCustomer = "/",
    redirectToLoginEmployee = "/employee/login",
    unauthorizedTo = "/unauthorized",
    superAdminBypass = true,
    superAdminCanAccessCustomer = false,
  } = opts;

  const Wrapper: FC<P> = (props) => {
    const router = useRouter();
    const customer = useAuthStore((s) => s.customer);
    const employee = useAuthStore((s) => s.employee);
    const isHydrated = useAuthStore((s) => s.isHydrated);
    const componentName =
      Component.displayName ??
      (Component as React.ComponentType<P> & { name?: string }).name ??
      "Component";

    Wrapper.displayName = `withAuthGuard(${componentName})`;
    const [hydratedFallback, setHydratedFallback] = useState(false);
    useEffect(() => {
      if (isHydrated === undefined) {
        const t = setTimeout(() => setHydratedFallback(true), 120);
        return () => clearTimeout(t);
      }
    }, [isHydrated]);

    const stillHydrating =
      (isHydrated !== undefined && !isHydrated) ||
      (isHydrated === undefined && !hydratedFallback);

    if (stillHydrating) return <Loading />;

    const isCustomer = !!customer?.id;
    const isEmployee = !!employee?.id;
    const isSuperAdmin =
      superAdminBypass && isEmployee && employee!.role === "super_admin";

    if (requireAuth) {
      if (principal === "customer") {
        if (!isCustomer) {
          if (!(superAdminCanAccessCustomer && isSuperAdmin)) {
            router.replace(redirectToLoginCustomer);
            return null;
          }
        }
      } else if (principal === "employee") {
        if (!isEmployee) {
          router.replace(redirectToLoginEmployee);
          return null;
        }
        if (!isSuperAdmin && allowedEmployeeRoles.length > 0) {
          if (!allowedEmployeeRoles.includes(employee!.role as EmployeeRole)) {
            router.replace(unauthorizedTo);
            return null;
          }
        }
      } else {
        const passAsCustomer = allowCustomerWhenAny && isCustomer;
        const passAsEmployee =
          isEmployee &&
          (isSuperAdmin ||
            allowedEmployeeRoles.length === 0 ||
            allowedEmployeeRoles.includes(employee!.role as EmployeeRole));

        if (!passAsCustomer && !passAsEmployee) {
          router.replace(
            allowedEmployeeRoles.length > 0
              ? redirectToLoginEmployee
              : redirectToLoginCustomer
          );
          return null;
        }
      }
    } else {
      if (principal === "employee" && isEmployee && !isSuperAdmin) {
        if (
          allowedEmployeeRoles.length > 0 &&
          !allowedEmployeeRoles.includes(employee!.role as EmployeeRole)
        ) {
          router.replace(unauthorizedTo);
          return null;
        }
      }
    }

    return <Component {...(props as P)} />;
  };

  Wrapper.displayName = `withAuthGuard(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapper;
}

"use client";

import Loading from "@/components/Loading";
import { useAuthStore } from "@/stores/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, type ComponentType, type FC } from "react";

export type EmployeeRole = "SUPER_ADMIN" | "OUTLET_ADMIN" | "DRIVER" | "WORKER";
type PrincipalType = "CUSTOMER" | "EMPLOYEE" | "any";

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

function useStoreHydrated(): boolean {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const ready = isHydrated ?? false;
  return ready;
}

export function withAuthGuard<P extends object>(
  Component: ComponentType<P>,
  opts: WithAuthOptions = {}
): ComponentType<P> {
  const cfgStatic = {
    requireAuth: opts.requireAuth ?? true,
    principal: opts.principal ?? "any",
    allowedEmployeeRoles: opts.allowedEmployeeRoles ?? [],
    allowCustomerWhenAny: opts.allowCustomerWhenAny ?? true,
    redirectToLoginCustomer: opts.redirectToLoginCustomer ?? "/customer/login",
    redirectToLoginEmployee: opts.redirectToLoginEmployee ?? "/employee/login",
    unauthorizedTo: opts.unauthorizedTo ?? "/unauthorized",
    superAdminBypass: opts.superAdminBypass ?? true,
    superAdminCanAccessCustomer: opts.superAdminCanAccessCustomer ?? false,
  };
  const cfgRef = { current: cfgStatic }; 

  const Wrapper: FC<P> = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const customer = useAuthStore((s) => s.customer);
    const employee = useAuthStore((s) => s.employee);
    const hydrated = useStoreHydrated();

    const userFlags = useMemo(() => {
      const isCustomer = !!customer?.id;
      const isEmployee = !!employee?.id;
      const isSuperAdmin =
        cfgRef.current.superAdminBypass &&
        isEmployee &&
        employee!.role === "SUPER_ADMIN";
      return { isCustomer, isEmployee, isSuperAdmin };
    }, [customer, employee]);

    const { allowed, redirectTo } = useMemo(() => {
      if (!hydrated) return { allowed: false, redirectTo: null as string | null };

      const {
        requireAuth,
        principal,
        allowedEmployeeRoles,
        allowCustomerWhenAny,
        redirectToLoginCustomer,
        redirectToLoginEmployee,
        unauthorizedTo,
        superAdminCanAccessCustomer,
      } = cfgRef.current;

      const { isCustomer, isEmployee, isSuperAdmin } = userFlags;

      if (!requireAuth) {
        if (principal === "EMPLOYEE" && isEmployee && !isSuperAdmin) {
          if (
            allowedEmployeeRoles.length > 0 &&
            !allowedEmployeeRoles.includes(employee!.role as EmployeeRole)
          ) {
            return { allowed: false, redirectTo: unauthorizedTo };
          }
        }
        return { allowed: true, redirectTo: null };
      }

      if (principal === "CUSTOMER") {
        if (isCustomer) return { allowed: true, redirectTo: null };
        if (superAdminCanAccessCustomer && isSuperAdmin)
          return { allowed: true, redirectTo: null };
        return { allowed: false, redirectTo: redirectToLoginCustomer };
      }

      if (principal === "EMPLOYEE") {
        if (!isEmployee) return { allowed: false, redirectTo: redirectToLoginEmployee };
        if (isSuperAdmin) return { allowed: true, redirectTo: null };
        if (
          allowedEmployeeRoles.length > 0 &&
          !allowedEmployeeRoles.includes(employee!.role as EmployeeRole)
        ) {
          return { allowed: false, redirectTo: unauthorizedTo };
        }
        return { allowed: true, redirectTo: null };
      }

      const passAsCustomer = allowCustomerWhenAny && isCustomer;
      const passAsEmployee =
        isEmployee &&
        (isSuperAdmin ||
          cfgRef.current.allowedEmployeeRoles.length === 0 ||
          cfgRef.current.allowedEmployeeRoles.includes(
            employee!.role as EmployeeRole
          ));

      if (passAsCustomer || passAsEmployee)
        return { allowed: true, redirectTo: null };

      return {
        allowed: false,
        redirectTo:
          cfgRef.current.allowedEmployeeRoles.length > 0
            ? redirectToLoginEmployee
            : redirectToLoginCustomer,
      };
    }, [hydrated, userFlags, employee]);

    useEffect(() => {
      if (!hydrated) return; 
      if (!allowed && redirectTo) {
        const url = new URL(redirectTo, window.location.origin);
        if (pathname) url.searchParams.set("next", pathname);
        if (url.pathname !== pathname) {
          router.replace(url.toString());
        }
      }
    }, [allowed, redirectTo, hydrated, pathname, router]);

    if (!hydrated) return <Loading />;
    if (!allowed) return null; 

    return <Component {...(props as P)} />;
  };

  Wrapper.displayName = `withAuthGuard(${Component.displayName || Component.name || "Component"})`;
  return Wrapper;
}

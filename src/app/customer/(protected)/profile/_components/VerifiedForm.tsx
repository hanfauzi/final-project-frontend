import { ShieldAlert, ShieldCheck } from "lucide-react";
import useGetCustomerProfile from "../_hooks/useGetProfile";
import { CustomerProfile } from "@/types/customerProfile";

export function VerifiedForm() {
  const { data, isLoading, isError } = useGetCustomerProfile();
  const profile = (data ?? null) as CustomerProfile | null;

  return (
    <>
      {!isLoading && !isError && profile && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-xl border p-3 md:p-4 ${
            profile.isVerified ? "border-ring/30 bg-accent" : "border-border bg-muted"
          }`}
        >
          {profile.isVerified ? (
            <ShieldCheck className="mt-0.5 h-5 w-5 text-primary md:h-6 md:w-6" />
          ) : (
            <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive md:h-6 md:w-6" />
          )}
          <div>
            <p className="text-sm font-semibold text-foreground md:text-[15px]">
              {profile.isVerified ? "Email terverifikasi" : "Email belum terverifikasi"}
            </p>
            <p className="text-xs text-muted-foreground md:text-sm">
              {profile.isVerified
                ? "Email anda telah terverifikasi"
                : "Tolong verifikasi email anda untuk keamanan akun"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

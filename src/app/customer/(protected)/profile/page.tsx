"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withAuthGuard } from "@/hoc/AuthGuard";
import {
  ChevronLeft
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { AvatarForm } from "./_components/AvatarForm";
import { ProfileForm } from "./_components/ProfileForm";
import { VerifiedForm } from "./_components/VerifiedForm";

function CustomerProfilePage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Profil • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-neutral-50">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-neutral-900">
              Profile
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm px-4 py-4 pb-24 ">
          <Card className="overflow-hidden rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <CardContent className="pt-5">
              <AvatarForm />
              <VerifiedForm />
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default withAuthGuard(CustomerProfilePage, {
  principal: "CUSTOMER",
  redirectToLoginCustomer: "/customer/login",
  superAdminCanAccessCustomer: true,
});

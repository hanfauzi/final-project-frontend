"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
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
        <title>Profile • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-transparent md:bg-transparent"> 
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur md:hidden">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-foreground">
              Profil
            </div>
          </div>
        </div>

        <div className="hidden md:block"> 
<div className="mx-auto w-full md:max-w-5xl md:px-6">
            <h1 className="text-xl font-semibold text-foreground">Profil</h1>
          </div>
        </div>

      <div className="mx-auto w-full max-w-sm px-4 py-4 pb-24 md:max-w-5xl md:px-6 md:py-8">
          <div className="grid md:grid-cols-none md:gap-6">
            <div className="md:col-span-8">
              <Card className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)] md:rounded-3xl md:shadow-xl">
                <CardContent className="pt-5 md:p-6">
                  <AvatarForm />
                  <VerifiedForm />
                  <ProfileForm />
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerProfilePage;

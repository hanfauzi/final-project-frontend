"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function PaymentFinishPage() {
  const q = useSearchParams();
  const orderId = q.get("order_id");

  return (
    <div className="relative min-h-[70vh] grid place-items-center px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(1200px 400px at 50% -50%, rgba(59,130,246,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(59,130,246,0.06), transparent 70%)",
        }}
      />

      <Card className="w-full max-w-md rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,.06)]">
        <CardHeader className="items-center pt-8">
          <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-ring/10 text-ring ring-1 ring-ring/20">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="mt-3 text-center text-2xl font-semibold text-foreground">
            Pembayaran Berhasil
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Terima kasih, pembayaran kamu sudah kami terima.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderId && (
            <div className="rounded-xl bg-muted px-4 py-3 text-sm">
              <span className="text-muted-foreground">Order ID:</span>{" "}
              <span className="font-medium">{orderId}</span>
            </div>
          )}

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="w-full sm:w-auto rounded-xl">
              <Link href="/customer/order" replace>
                Kembali ke pesanan
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto rounded-xl">
              <Link href="/" replace>
                Ke beranda
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

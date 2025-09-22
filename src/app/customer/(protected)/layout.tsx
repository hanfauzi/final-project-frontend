import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import ClientAuth from "./ClientAuth";
import { Footer } from "@/components/Footer";

export default function CustomerProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background md:bg-gradient-to-b md:from-background md:to-muted/30"> 
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 md:opacity-80" 
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1600px 520px at 50% -60%, rgba(0,0,0,0.06), transparent 60%), radial-gradient(900px 360px at 100% 0%, rgba(0,0,0,0.04), transparent 70%)",
        }}
      />

      <Navbar />

    <main className="mx-auto w-full max-w-sm px-4 py-4 md:max-w-5xl md:px-6 md:py-8">
        <ClientAuth>{children}</ClientAuth>
      </main>

      <Footer />
      <div className="h-6" />
    </div>
  );
}

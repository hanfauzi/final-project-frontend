import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import ClientAuth from "./ClientAuth";
import { Footer } from "@/components/Footer";

export default function CustomerProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-neutral-50">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
        }}
      />
      <Navbar />
      <main className="mx-auto w-full max-w-sm px-4 py-4">
        <ClientAuth>{children}</ClientAuth>
      </main>
      <Footer/>
      <div className="h-6" />
    </div>
  );
}

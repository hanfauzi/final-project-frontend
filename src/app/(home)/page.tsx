"use client";

import { Footer } from "@/components/Footer";
import { HomeCarousel } from "@/app/(home)/_components/HomeCarousel";
import { Navbar } from "@/components/Navbar";
import { Services } from "@/app/(home)/_components/Services";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Laundr — Mudah, Bersih, Cepat</title>
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

        <Navbar />

        <main className="mx-auto w-full max-w-sm">
          <HomeCarousel />
          <Services />
        </main>

        <Footer />
      </div>
    </>
  );
}

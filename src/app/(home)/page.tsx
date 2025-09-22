"use client";

import { HomeCarousel } from "@/app/(home)/_components/HomeCarousel";
import { ServicesBand } from "@/app/(home)/_components/Services";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Head from "next/head";
import AboutUs from "./_components/AboutUs";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <>
      <Head><title>Laundr — Mudah, Bersih, Cepat</title></Head>

      <div className="relative min-h-screen bg-background md:bg-gradient-to-b md:from-background md:to-muted/30"> 
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 md:opacity-80" 
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(900px 380px at 100% -10%, rgba(0,0,0,0.05), transparent 70%)",
          }}
        />


        <main className="mx-auto w-full max-w-sm md:max-w-full "> 
        <Navbar />
          <Hero/>
          <HomeCarousel />
          <AboutUs/>
          <ServicesBand />
        </main>

        <Footer />
      </div>
    </>
  );
}

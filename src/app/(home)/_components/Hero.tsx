"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Hero Laundr"
    >
      <div className="relative h-[58vh] min-h-[420px] md:h-[72vh]">
        <Image
          src="/hero.jpg" 
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/25" />
      </div>

      <div className="absolute inset-0">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="pt-16 md:pt-24 lg:pt-28 w-full max-w-3xl">
            <h1 className="text-white font-bold leading-tight tracking-[-0.02em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="block">Waktu Luangmu, Bukan untuk Laundry.</span>
              <span className="block">Jemput Sekarang, Bersih Hari Ini.</span>
            </h1>

            <p className="mt-4 text-white/90 text-sm sm:text-base md:text-lg max-w-2xl">
              Serahkan ke Laundr—jemput, cuci, setrika, antar. Tracking real-time,
              pembayaran aman, kualitas outlet tepercaya.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

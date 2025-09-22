"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HomeCarousel() {
  const slides = [
    { id: 1, src: "/lipetan.jpg", alt: "Lipetan rapi" },
    { id: 2, src: "/mesin-cuci.jpg", alt: "Mesin cuci" },
    { id: 3, src: "/gantungan.jpg", alt: "Pakaian di gantungan" },
  ];

  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(t);
  }, [pause, slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section
      className="mt-3 px-5 md:px-10 md:mt-6"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      aria-roledescription="carousel"
      aria-label="Promo Laundr"
    >
      <div className="relative w-full  aspect-[16/9] md:aspect-[21/8] overflow-hidden bg-black">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
             <div className="pointer-events-none absolute inset-0 bg-black/20" /> 
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:px-4">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={prev}
            className="pointer-events-auto h-9 w-9 rounded-full/none bg-background/70 backdrop-blur hover:bg-background/90"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={next}
            className="pointer-events-auto h-9 w-9 rounded-full/none bg-background/70 backdrop-blur hover:bg-background/90"
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

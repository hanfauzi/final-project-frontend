"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import Image from "next/image"; 

export function HomeCarousel() {
  const slides = [
    { id: 1, src: "/images/hero-1.jpg", alt: "Promo 1" },
    { id: 2, src: "/images/hero-2.jpg", alt: "Promo 2" },
    { id: 3, src: "/images/hero-3.jpg", alt: "Promo 3" },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false); 

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (pause) return; 

    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        const child = el.children[next] as HTMLElement | undefined;
        child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length, pause]); 

  return (
    <section className="mt-3 md:mt-6"> 
      <div
        ref={containerRef}
        className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)} 
      >
        <div className="flex w-full">
          {slides.map((s) => (
            <div key={s.id} className="min-w-full snap-start px-4 md:px-0"> 
              <Card className="rounded-2xl overflow-hidden border border-border shadow-[0_8px_30px_rgba(0,0,0,.06)] md:rounded-3xl md:shadow-xl"> 
                <CardContent className="p-0">
                  <div className="relative w-full aspect-[16/9] md:aspect-[21/8] bg-muted"> 
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1024px" 
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" /> 
                    <div className="absolute bottom-3 left-4 right-4 md:bottom-5 md:left-6 md:right-auto md:max-w-md"> 
                      <div className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-[11px] font-medium text-primary-foreground md:text-xs"> 
                        Promo Spesial
                      </div>
                      <h3 className="mt-2 text-white text-lg font-semibold drop-shadow md:text-2xl"> 
                        {s.alt}
                      </h3>
                      <p className="text-white/90 text-xs md:text-sm">
                        Cuci, setrika, lipat — cepat & hemat di Laundr.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 md:mt-4"> 
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Slide ${i + 1}`}
            onClick={() => {
              setIndex(i);
              const el = containerRef.current;
              const child = el?.children[i] as HTMLElement | undefined;
              child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
            }} 
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

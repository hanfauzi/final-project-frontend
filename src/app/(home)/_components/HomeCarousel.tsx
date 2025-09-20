import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";

export function HomeCarousel() {
  const slides = [
    { id: 1, src: "/images/hero-1.jpg", alt: "Promo 1" },
    { id: 2, src: "/images/hero-2.jpg", alt: "Promo 2" },
    { id: 3, src: "/images/hero-3.jpg", alt: "Promo 3" },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        const child = el.children[next] as HTMLElement | undefined;
        child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="mt-3">
      <div
        ref={containerRef}
        className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
    >
        <div className="flex w-full">
          {slides.map((s, i) => (
            <div key={s.id} className="min-w-full snap-start px-4">
              <Card className="rounded-2xl overflow-hidden border border-border shadow-[0_8px_30px_rgba(0,0,0,.06)]">
                <CardContent className="p-0">
                  <div className="h-44 w-full bg-muted grid place-items-center text-muted-foreground text-sm">
                    Gambar Carousel {i + 1}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <span
            key={s.id}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

export function ServicesBand() {
  const items = [
    { key: "pickup", title: "Antar–Jemput", desc: "Kami ambil dan antar kembali tepat waktu—door to door." },
    { key: "wash",   title: "Cuci",         desc: "Pencucian higienis dengan proses terstandar & bahan terpilih." },
    { key: "iron",   title: "Setrika",      desc: "Rapi, halus, dan wangi—siap pakai kapan saja." },
    { key: "fold",   title: "Lipat",        desc: "Dilipat rapi agar mudah disimpan dan tidak kusut." },
  ] as const;

  const accents = ["bg-primary/70","bg-emerald-500/70","bg-sky-500/70","bg-violet-500/70"];

  return (
    <section
      id="services"
      className="relative bg-[radial-gradient(1200px_500px_at_50%_-10%,hsl(var(--ring)/.10),transparent_60%)]"
    >
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground md:text-2xl">Layanan Kami</h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Semua yang kamu butuh untuk urusan laundry—tanpa ribet.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-border">
          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
            {items.map((it, i) => (
              <div key={it.key} className="relative p-5 md:p-6">
                <span className={`absolute inset-x-0 top-0 h-0.5 ${accents[i % accents.length]}`} />
                <h3 className="text-[15px] font-semibold text-foreground">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

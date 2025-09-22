"use client";

import { Flame, FoldVertical, Shirt, Truck } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export function Services() {
  const data = [
    { key: "pickup", icon: <Truck className="h-5 w-5" />, title: "Antar Jemput", desc: "Kami ambil & antar pakaianmu tepat waktu." },
    { key: "wash", icon: <Shirt className="h-5 w-5" />, title: "Cuci", desc: "Pencucian higienis dengan detergen berkualitas." },
    { key: "iron", icon: <Flame className="h-5 w-5" />, title: "Setrika", desc: "Rapi & wangi, siap pakai kapan saja." },
    { key: "fold", icon: <FoldVertical className="h-5 w-5" />, title: "Lipat", desc: "Dilipat rapi agar mudah disimpan." },
  ] as const;

  const chips = ["Cepat", "Hemat", "Higienis", "Terpercaya"]; 

  return (
    <section id="services" className="mt-6 px-4 md:mt-10 md:px-0"> 
      <div className="md:flex md:items-end md:justify-between md:gap-6"> 
        <div>
          <h2 className="text-base font-semibold text-foreground md:text-2xl"> 
            Layanan Kami
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground md:text-base"> 
            Empat layanan utama untuk urusan laundry-mu.
          </p>
        </div>

        <div className="hidden md:flex md:flex-wrap md:gap-2"> 
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-4 md:gap-4"> 
        {data.map((s, idx) => (
          <Card
            key={s.key}
            className="rounded-2xl border border-border shadow-[0_6px_20px_rgba(0,0,0,.05)] hover:shadow-lg transition-shadow md:rounded-3xl" 
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start gap-2.5 md:gap-3"> 
                <div
                  className={`grid h-9 w-9 place-items-center rounded-xl text-primary-foreground md:h-10 md:w-10
                    ${["bg-primary","bg-emerald-600","bg-sky-600","bg-violet-600"][idx % 4]}`} 
                >
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground md:text-[15px]"> 
                    {s.title}
                  </div>
                  <div className="text-xs text-muted-foreground md:text-[13px]">{s.desc}</div> 
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

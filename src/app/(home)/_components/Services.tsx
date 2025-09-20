import { Flame, FoldVertical, Shirt, Truck } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export function Services() {
  const data = [
    { key: "pickup", icon: <Truck className="h-5 w-5" />, title: "Antar Jemput", desc: "Kami ambil & antar pakaianmu tepat waktu." },
    { key: "wash", icon: <Shirt className="h-5 w-5" />, title: "Cuci", desc: "Pencucian higienis dengan detergen berkualitas." },
    { key: "iron", icon: <Flame className="h-5 w-5" />, title: "Setrika", desc: "Rapi & wangi, siap pakai kapan saja." },
    { key: "fold", icon: <FoldVertical className="h-5 w-5" />, title: "Lipat", desc: "Dilipat rapi agar mudah disimpan." },
  ] as const;

  return (
    <section id="services" className="mt-6 px-4">
      <h2 className="text-base font-semibold text-foreground">Layanan Kami</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Empat layanan utama untuk urusan laundry-mu.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {data.map((s) => (
          <Card
            key={s.key}
            className="rounded-2xl border border-border shadow-[0_6px_20px_rgba(0,0,0,.05)]"
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {s.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

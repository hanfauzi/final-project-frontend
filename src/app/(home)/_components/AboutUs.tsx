import { Clock, Leaf, ShieldCheck, Smartphone, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Laundr",
  description: "Sejarah, misi, dan alasan di balik Laundr—jemput, cuci, setrika, antar dengan standar tepercaya.",
};



const values = [
  { icon: <ShieldCheck className="h-4 w-4" />, title: "Kualitas Konsisten", desc: "Standar proses & QC yang rapi di semua outlet." },
  { icon: <Truck className="h-4 w-4" />, title: "Jemput–Antar Fleksibel", desc: "Penjadwalan sesuai waktumu. Kami yang menyesuaikan." },
  { icon: <Smartphone className="h-4 w-4" />, title: "Transparan & Real-time", desc: "Lihat progres cucian dari ponsel—tanpa menebak." },
  { icon: <Leaf className="h-4 w-4" />, title: "Lebih Peduli", desc: "Bahan pembersih yang lebih aman & praktik ramah lingkungan." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section id="about" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 pt-14 pb-10 md:px-10 md:pt-20 md:pb-14">
  

          <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Waktu luangmu bukan untuk laundry.
              </h1>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Laundr hadir untuk mengembalikan waktumu. Jemput–antar fleksibel, proses profesional, dan status pesanan yang
                bisa kamu pantau real-time.
              </p>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-border">
              <Image
                src="/mesin-cuci.jpg"
                alt="Proses laundry profesional Laundr"
                fill
                priority
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">Kenapa harus Laundr?</h2>

          <div className="mt-5 grid gap-4 lg:grid-cols-12">
            <div className="rounded-2xl bg-primary/10 p-5 ring-1 ring-primary/20 lg:col-span-5">
              <h3 className="text-[15px] font-semibold text-foreground">Sederhana dipakai</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Penjadwalan jemput dalam hitungan detik</li>
                <li>Pilih alamat favorit & simpan catatan</li>
                <li>Notifikasi progres yang relevan</li>
              </ul>
              <div className="mt-3 inline-flex items-center gap-2 text-[13px] text-foreground">
                <Smartphone className="h-4 w-4" /> Aplikasi yang ringan & cepat
              </div>
            </div>

            <div className="rounded-2xl bg-accent/20 p-5 ring-1 ring-accent/30 lg:col-span-4">
              <h3 className="text-[15px] font-semibold text-foreground">Transparansi biaya</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Estimasi jelas sebelum konfirmasi</li>
                <li>Tanpa biaya tersembunyi</li>
                <li>Pembayaran aman & banyak metode</li>
              </ul>
              <div className="mt-3 inline-flex items-center gap-2 text-[13px] text-foreground">
                <ShieldCheck className="h-4 w-4" /> Proteksi transaksi
              </div>
            </div>

            <div className="rounded-2xl bg-muted p-5 ring-1 ring-border lg:col-span-3">
              <h3 className="text-[15px] font-semibold text-foreground">Pengantaran disiplin</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Kurir terlatih & rute efisien</li>
                <li>Window pengantaran yang jelas</li>
                <li>Pelacakan status pesanan</li>
              </ul>
              <div className="mt-3 inline-flex items-center gap-2 text-[13px] text-foreground">
                <Truck className="h-4 w-4" /> Tepat waktu itu budaya
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-emerald-50/40 dark:bg-emerald-900/10">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200/60 bg-white/70 p-6 backdrop-blur dark:border-emerald-800/40 dark:bg-emerald-950/30">
              <h3 className="text-base font-semibold text-foreground">Janji Kebersihan Laundr</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Quality control berlapis di setiap tahap</li>
                <li>Garansi ulang jika hasil tidak sesuai standar</li>
                <li>Disinfeksi berkala area kerja & kendaraan kurir</li>
              </ul>
              <div className="mt-3 inline-flex items-center gap-2 text-[13px] text-foreground">
                <Clock className="h-4 w-4" /> SOP diperbarui mengikuti best practice
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200/60 bg-white/70 p-6 backdrop-blur dark:border-emerald-800/40 dark:bg-emerald-950/30">
              <h3 className="text-base font-semibold text-foreground">Keberlanjutan</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Opsi deterjen yang lebih aman digunakan</li>
                <li>Optimasi rute untuk mengurangi emisi</li>
                <li>Program reuse hanger & packaging</li>
              </ul>
              <div className="mt-3 inline-flex items-center gap-2 text-[13px] text-foreground">
                <Leaf className="h-4 w-4" /> Kecilkan jejak, besarkan manfaat
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/40">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">Nilai yang Kami Pegang</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-border bg-background/60 p-4 backdrop-blur transition hover:bg-background"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-muted text-foreground">{v.icon}</span>
                  <div className="text-[14px] font-semibold text-foreground">{v.title}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/15 via-accent/20 to-primary/15">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-10">
          <div className="grid gap-4 text-center sm:grid-cols-3">
            <StatItem k="98%" v="Order Tepat Waktu" />
            <StatItem k="30K+" v="Pesanan Ditangani" />
            <StatItem k="4.9/5" v="Rata-rata Penilaian" />
          </div>
        </div>
      </section>

      <div className="h-8" />
    </main>
  );
}

function StatItem({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-background/60 px-4 py-3 ring-1 ring-border backdrop-blur">
      <div className="text-2xl font-bold text-foreground">{k}</div>
      <div className="text-[13px] text-muted-foreground">{v}</div>
    </div>
  );
}

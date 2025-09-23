import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      className={[
        "mt-12 md:mt-16",
        "border-t border-border/60",
        "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-sm px-4 py-8 md:max-w-5xl md:px-6 md:py-10">
        <Link
          href="/"
          aria-label="Ke beranda"
          className="inline-flex items-center px-2 py-1 -mx-2"
        >
          <div className="relative h-7 w-[112px] sm:h-8 sm:w-[128px] md:h-9 md:w-[150px]">
            <Image
              src="/logo-text-laundr.png"
              alt="Laundr"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 128px, 150px"
              priority
            />
          </div>
        </Link>

        <p className="mt-2 text-base text-muted-foreground md:text-[17px]">
          Waktu luangmu bukan untuk laundry.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-6 md:mt-8 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground mb-2 md:text-base">
              Navigasi
            </h3>
            <ul className="space-y-1.5 text-[15px] text-muted-foreground md:text-[15px]">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-foreground">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-foreground">
                  Layanan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-foreground mb-2 md:text-base">
              Kontak
            </h3>
            <ul className="space-y-1.5 text-[15px] text-muted-foreground">
              <li>
                Telp:{" "}
                <a className="underline underline-offset-2 hover:text-foreground">
                  0812-3456-7890
                </a>
              </li>
              <li>
                Email:{" "}
                <a className="underline underline-offset-2 hover:text-foreground">
                  laundrproject@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-[15px] font-semibold text-foreground mb-2 md:text-base">
              Kenapa Laundr?
            </h3>
            <ul className="space-y-1.5 text-[15px] text-muted-foreground">
              <li>Cepat & tepat waktu</li>
              <li>Harga transparan</li>
              <li>Dukungan pelanggan ramah</li>
            </ul>
          </div>
        </div>

        <div
          id="about"
          className="mt-6 text-xs text-muted-foreground/90 md:mt-8 md:text-sm"
        >
          © {new Date().getFullYear()} Laundr. All rights reserved.
        </div>
      </div>

      <div className="h-6" />
    </footer>
  );
}

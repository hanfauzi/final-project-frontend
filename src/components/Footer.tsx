import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-background">
      <div className="mx-auto w-full max-w-sm px-4 py-8">
        <Link
          href="/"
          aria-label="Ke beranda"
          className="inline-flex items-center px-2 py-1 -mx-2"
        >
          <div className="relative h-7 w-[112px] sm:h-8 sm:w-[128px]">
            <Image
              src="/logo-text-laundr.png"
              alt="Laundr"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 112px, 128px"
              priority
            />
          </div>
        </Link>

        <p className="mt-2 text-base text-muted-foreground">
          Bikin urusan laundry jadi gampang.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground mb-2">
              Navigasi
            </h3>
            <ul className="space-y-1.5 text-[15px] text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Beranda</Link></li>
              <li><a href="#about" className="hover:text-foreground">Tentang Kami</a></li>
              <li><a href="#services" className="hover:text-foreground">Layanan</a></li>
              <li><Link href="/contact" className="hover:text-foreground">Kontak Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-foreground mb-2">
              Kontak
            </h3>
            <ul className="space-y-1.5 text-[15px] text-muted-foreground">
              <li>
                Telp:{" "}
                <a href="tel:+62081234567890" className="underline underline-offset-2 hover:text-foreground">
                  0812-3456-7890
                </a>
              </li>
              <li>
                Email:{" "}
                <a href="laundrproject@gmail.com" className="underline underline-offset-2 hover:text-foreground">
                  laundrproject@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div id="about" className="mt-6 text-xs text-muted-foreground/90">
          © {new Date().getFullYear()} Laundr. All rights reserved.
        </div>
      </div>

      <div className="h-6" />
    </footer>
  );
}

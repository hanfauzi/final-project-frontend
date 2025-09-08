import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto w-full max-w-sm px-4 py-6">
        <div className="text-lg font-black text-neutral-900">Laundr</div>
        <div className="mt-1 text-sm text-neutral-600">
          Bikin urusan laundry jadi gampang.
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-semibold text-neutral-900 mb-1">
              Navigasi
            </div>
            <ul className="space-y-1 text-sm text-neutral-600">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#services">Service</a>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-900 mb-1">
              Kontak
            </div>
            <ul className="space-y-1 text-sm text-neutral-600">
              <li>
                Telp:{" "}
                <a
                  href="tel:+62081234567890"
                  className="underline underline-offset-2"
                >
                  0812-3456-7890
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:hello@laundr.id"
                  className="underline underline-offset-2"
                >
                  hello@laundr.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div id="about" className="mt-5 text-[11px] text-neutral-500">
          © {new Date().getFullYear()} Laundr. All rights reserved.
        </div>
      </div>
      <div className="h-6" />
    </footer>
  );
}

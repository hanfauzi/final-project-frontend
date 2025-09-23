import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-2 border-border" />
          <span className="absolute inset-0 rounded-full border-t-2 border-ring animate-spin" />
          <Image
            src="/logo-icon.png"
            alt="Laundr"
            fill
            className="p-2 object-contain"
            sizes="64px"
            priority
          />
        </div>
        <div className="relative h-6 w-[140px] md:h-7 md:w-[170px]">
          <Image
            src="/logo-text-laundr.png"
            alt="Laundr"
            fill
            className="object-contain"
            sizes="170px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

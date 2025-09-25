import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export default function OutletAdminPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="OUTLET DASHBOARD"
        rightElement={
          <Image
            src={"/logo-text-laundr.png"}
            alt="laundr image"
            width={100}
            height={50}
            className="rounded-full"
          />
        }
      />
    </div>
  );
}

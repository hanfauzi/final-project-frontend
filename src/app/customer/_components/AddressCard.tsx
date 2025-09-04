import { Card, CardContent } from "@/components/ui/card";
import { CustomerAddress } from "../_hooks/useGetAddresses";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AddressCard({
  data,
  active,
  onSelect,
  onMore,
}: {
  data: CustomerAddress;
  active: boolean;
  onSelect: () => void;
  onMore: () => void;
}) {
  const labelText =
    data.label === "HOME"
      ? "Rumah"
      : data.label === "WORK"
      ? "Kantor"
      : "Lainnya";
  const pinpointed =
    Number.isFinite(data.latitude) && Number.isFinite(data.longitude);

  return (
    <Card
      onClick={onSelect}
      className={[
        "relative transition cursor-pointer border-neutral-200",
        active
          ? "ring-1 ring-neutral-900 border-neutral-900 bg-neutral-50"
          : "",
      ].join(" ")}
    >
      <span
        className={`absolute left-0 top-4 h-5 w-1.5 rounded-r ${
          data.isPrimary ? "bg-neutral-900" : "bg-neutral-300"
        }`}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 pr-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-neutral-300 text-neutral-800"
              >
                {labelText}
              </Badge>
              {data.isPrimary && (
                <Badge className="bg-neutral-900 text-white">Utama</Badge>
              )}
            </div>
            <div className="text-sm text-neutral-700">{data.phoneNumber}</div>
            <div className="text-sm text-neutral-600 leading-snug">
              {data.address}, {data.city} {data.postalCode}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 pt-1">
              <MapPin className="h-4 w-4" />
              {pinpointed ? "Sudah Pinpoint" : "Belum Pinpoint"}
            </div>
            {data.notes && (
              <div className="text-xs text-neutral-500">{data.notes}</div>
            )}
            <div className="pt-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-neutral-300 text-neutral-900 hover:bg-neutral-100"
              >
                <Link
                  href={`/customer/address/edit/${data.id}`}
                  onClick={(e) => e.stopPropagation()} 
                  className="inline-flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Ubah Alamat
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            {active ? (
              <CheckCircle2 className="h-6 w-6 text-neutral-900" />
            ) : (
              <div className="h-6 w-6" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                onMore();
              }}
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
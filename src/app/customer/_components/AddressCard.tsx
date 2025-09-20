import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CustomerAddress } from "../(protected)/address/_hooks/useGetAddresses";

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
    data.label === "HOME" ? "Rumah" : data.label === "WORK" ? "Kantor" : "Lainnya";
  const pinpointed = Number.isFinite(data.latitude) && Number.isFinite(data.longitude);

  return (
    <Card
      onClick={onSelect}
      className={[
        "relative transition cursor-pointer border border-border bg-card text-card-foreground",
        active ? "ring-1 ring-ring border-ring bg-accent" : "",
      ].join(" ")}
    >
      <span
        className={`absolute left-0 top-4 h-5 w-1.5 rounded-r ${
          data.isPrimary ? "bg-primary" : "bg-border"
        }`}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 pr-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-border text-foreground">
                {labelText}
              </Badge>
              {data.isPrimary && (
                <Badge className="bg-primary text-primary-foreground">Utama</Badge>
              )}
            </div>
            <div className="text-sm text-foreground">{data.phoneNumber}</div>
            <div className="text-sm text-muted-foreground leading-snug">
              {data.address}, {data.city} {data.postalCode}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <MapPin className="h-4 w-4" />
              {pinpointed ? "Sudah Pinpoint" : "Belum Pinpoint"}
            </div>
            {data.notes && (
              <div className="text-xs text-muted-foreground">{data.notes}</div>
            )}
            <div className="pt-3">
              <Button asChild variant="outline" size="sm" className="h-9 rounded-xl border-border hover:bg-accent">
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
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <div className="h-6 w-6" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent"
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

"use client";

import CardMap from "@/app/customer/(protected)/address/_components/CardMap";
import { LabelChips } from "@/app/customer/(protected)/address/_components/LabelChips";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormikContextType } from "formik";
import { MapPin } from "lucide-react";
import type { LabelEnum } from "../_hooks/useEditAddress";

export type AddressFormValues = {
  label: LabelEnum;
  address: string;
  notes: string | null;
  city: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  pinpoint: string;
  makePrimary: boolean;
};

type Props = {
  formik: FormikContextType<AddressFormValues>;
  coordsReady: boolean;
};

function useFieldError<K extends keyof AddressFormValues>(
  formik: FormikContextType<AddressFormValues>,
  name: K
): string | undefined {
  const touched = formik.touched[name];
  const error = formik.errors[name];

  const isTouched = typeof touched === "boolean" ? touched : false;
  const message = typeof error === "string" ? error : undefined;

  return isTouched ? message : undefined;
}

function FieldError<K extends keyof AddressFormValues>({
  formik,
  name,
}: {
  formik: FormikContextType<AddressFormValues>;
  name: K;
}) {
  const msg = useFieldError(formik, name);
  if (!msg) return null;
  return <p className="text-[12px] text-destructive mt-1">{msg}</p>;
}

export default function CreateAddressFormCard({ formik, coordsReady }: Props) {
  return (
    <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)]">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={[
              "inline-flex items-center gap-1 px-2 py-1 rounded-full",
              coordsReady
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            <MapPin className="h-3 w-3" />
            {coordsReady ? "Koordinat tersimpan" : "Pilih titik di peta"}
          </span>
          {!coordsReady && (
            <span className="text-muted-foreground">
              (wajib untuk simpan alamat)
            </span>
          )}
        </div>

        <div className="space-y-2">
  <UILabel className="text-foreground">Label Alamat</UILabel>
<LabelChips
  value={formik.values.label}
  onChange={(v) => {
    formik.setFieldValue("label", v);
    formik.setFieldTouched("label", true, false);
  }}
/>
<FieldError formik={formik} name="label" />
        </div>

        <div className="space-y-2">
          <UILabel className="text-foreground">Alamat Lengkap</UILabel>
<Textarea
  name="address"
  placeholder="Tulis alamat lengkap anda di sini"
  value={formik.values.address}
  onChange={(e) => formik.setFieldValue("address", e.target.value)}
  onBlur={() => formik.setFieldTouched("address", true)}
  className="min-h-24 rounded-xl bg-card border-border placeholder:text-muted-foreground focus-visible:ring-ring"
  maxLength={200}
/>
<div className="text-xs text-muted-foreground text-right">
  {formik.values.address.length}/200
</div>
<FieldError formik={formik} name="address" />
        </div>

        <div className="space-y-2">
          <UILabel className="text-foreground">
            Catatan Untuk Kurir (Opsional)
          </UILabel>
          <Input
            placeholder="Warna rumah, patokan, pesan khusus, dll."
            value={formik.values.notes ?? ""}
            onChange={(e) => formik.setFieldValue("notes", e.target.value)}
            className="h-11 rounded-xl bg-card border-border placeholder:text-muted-foreground focus-visible:ring-ring"
            maxLength={200}
          />
          <div className="text-xs text-muted-foreground text-right">
            {formik.values.notes?.length ?? 0}/200
          </div>
        </div>

        <div className="space-y-2">
          <UILabel className="text-foreground">Kota/Kabupaten</UILabel>
         <Input
  name="city"
  value={formik.values.city}
  onChange={(e) => formik.setFieldValue("city", e.target.value)}
  onBlur={() => formik.setFieldTouched("city", true)}
  className="h-11 rounded-xl bg-card border-border focus-visible:ring-ring"
/>
<FieldError formik={formik} name="city" />
        </div>

        <div className="space-y-2">
          <UILabel className="text-foreground">Kode Pos</UILabel>
         <Input
  name="postalCode"
  inputMode="numeric"
  value={formik.values.postalCode}
  onChange={(e) => {
    const onlyDigits = e.target.value.replace(/\D+/g, "").slice(0, 5);
    formik.setFieldValue("postalCode", onlyDigits);
  }}
  onBlur={() => formik.setFieldTouched("postalCode", true)}
  className="h-11 rounded-xl bg-card border-border focus-visible:ring-ring"
/>
<FieldError formik={formik} name="postalCode" />
        </div>

        <div className="space-y-2">
          <UILabel className="text-foreground">Nomor HP</UILabel>
         <Input
  name="phoneNumber"
  inputMode="tel"
  value={formik.values.phoneNumber}
  onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
  onBlur={() => formik.setFieldTouched("phoneNumber", true)}
  className="h-11 rounded-xl bg-card border-border focus-visible:ring-ring"
/>
<FieldError formik={formik} name="phoneNumber" />
        </div>

        <CardMap
  initial={{
    lat: formik.values.latitude,
    lng: formik.values.longitude,
    addressLine: formik.values.pinpoint,
    city: formik.values.city,
    postalCode: formik.values.postalCode,
  }}
  onLocationSelect={(loc) => {
    formik.setFieldValue("latitude", loc.latitude);
    formik.setFieldValue("longitude", loc.longitude);
    formik.setFieldTouched("latitude", true, false);
    formik.setFieldTouched("longitude", true, false);

    formik.setFieldValue("pinpoint", loc.addressLine ?? "");
    if (!formik.values.postalCode?.trim()) formik.setFieldValue("postalCode", loc.postalCode ?? "");
    if (!formik.values.city?.trim()) formik.setFieldValue("city", loc.city ?? "");
    if (!formik.values.address?.trim()) formik.setFieldValue("address", loc.addressLine ?? "");
  }}
/>
<div className="grid grid-cols-2 gap-2">
  <FieldError formik={formik} name="latitude" />
  <FieldError formik={formik} name="longitude" />
</div>

        <div className="pt-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="makePrimary"
              checked={formik.values.makePrimary}
              onCheckedChange={(v) =>
                formik.setFieldValue("makePrimary", Boolean(v))
              }
            />
            <UILabel htmlFor="makePrimary" className="text-sm">
              Jadikan alamat utama
            </UILabel>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

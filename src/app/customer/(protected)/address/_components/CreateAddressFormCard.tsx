"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { FormikContextType } from "formik";
import { LabelChips } from "@/app/customer/_components/LabelChips";
import type { LabelEnum } from "../_hooks/useEditAddress";
import CardMap from "@/app/customer/_components/CardMap";

export type AddressFormValues = {
  label: LabelEnum;
  address: string;
  notes: string | null;
  city: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  pinpoint: string;      // preview alamat dari reverse geocode
  makePrimary: boolean;
};

type Props = {
  formik: FormikContextType<AddressFormValues>;
  coordsReady: boolean;
};

export default function CreateAddressFormCard({ formik, coordsReady }: Props) {
  return (
    <Card className="rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-neutral-800">
          Detail Alamat
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardMap   initial={{
                  lat: formik.values.latitude,
                  lng: formik.values.longitude,
                  addressLine: formik.values.pinpoint,
                  city: formik.values.city,
                }}
          onLocationSelect={(loc: {
            addressLine: string;
            city: string;
            latitude: number;
            longitude: number;
            isPrimary?: boolean;
          }) => {
            // set koordinat
            formik.setFieldValue("latitude",  loc.latitude);
            formik.setFieldValue("longitude", loc.longitude);

            // set preview "pinpoint" + kota
            formik.setFieldValue("pinpoint",  loc.addressLine);
            formik.setFieldValue("city",      loc.city ?? "");

            // kalau alamat user masih kosong/belum diisi, auto-isi dari reverse geocode
            if (!formik.values.address || formik.values.address.trim().length === 0) {
              formik.setFieldValue("address", loc.addressLine);
            }
          }}
        />

        <div className="flex items-center gap-2 text-xs">
          <span
            className={[
              "inline-flex items-center gap-1 px-2 py-1 rounded-full",
              coordsReady ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700",
            ].join(" ")}
          >
            <MapPin className="h-3 w-3" />
            {coordsReady ? "Koordinat tersimpan" : "Pilih titik di peta"}
          </span>
          {!coordsReady && (
            <span className="text-neutral-500">(wajib untuk simpan alamat)</span>
          )}
        </div>

        <div className="space-y-2">
          <UILabel className="text-neutral-900">Label Alamat</UILabel>
          <LabelChips
            value={formik.values.label}
            onChange={(v) => formik.setFieldValue("label", v)}
          />
        </div>

        <div className="space-y-2">
          <UILabel className="text-neutral-900">Alamat Lengkap</UILabel>
          <Textarea
            placeholder="Nama jalan, nomor rumah, RT/RW, dsb"
            value={formik.values.address}
            onChange={(e) => formik.setFieldValue("address", e.target.value)}
            className="min-h-24 rounded-xl bg-white border-neutral-300"
            maxLength={200}
          />
          <div className="text-xs text-neutral-500 text-right">
            {formik.values.address.length}/200
          </div>
        </div>

        <div className="space-y-2">
          <UILabel className="text-neutral-900">Catatan Untuk Kurir (Opsional)</UILabel>
          <Input
            placeholder="Warna rumah, patokan, pesan khusus, dll."
            value={formik.values.notes ?? ""}
            onChange={(e) => formik.setFieldValue("notes", e.target.value)}
            className="h-11 rounded-xl bg-white border-neutral-300"
            maxLength={200}
          />
          <div className="text-xs text-neutral-500 text-right">
            {formik.values.notes?.length ?? 0}/200
          </div>
        </div>

        <div className="space-y-2">
          <UILabel className="text-neutral-900">Kota/Kabupaten</UILabel>
          <Input
            value={formik.values.city}
            onChange={(e) => formik.setFieldValue("city", e.target.value)}
            className="h-11 rounded-xl bg-white border-neutral-300"
          />
        </div>

        <div className="space-y-2">
          <UILabel className="text-neutral-900">Kode Pos</UILabel>
          <Input
            value={formik.values.postalCode}
            onChange={(e) => formik.setFieldValue("postalCode", e.target.value)}
            className="h-11 rounded-xl bg-white border-neutral-300"
          />
        </div>

        <div className="space-y-2">
          <UILabel className="text-neutral-900">Nomor HP</UILabel>
          <Input
            value={formik.values.phoneNumber}
            onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
            className="h-11 rounded-xl bg-white border-neutral-300"
          />
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

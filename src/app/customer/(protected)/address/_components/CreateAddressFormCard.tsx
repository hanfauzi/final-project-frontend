"use client";

import CardMap from "@/app/customer/_components/CardMap";
import { LabelChips } from "@/app/customer/_components/LabelChips";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormikContextType } from "formik";
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

export default function CreateAddressFormCard({ formik}: Props) {
  return (
    <Card className="rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,.06)]">

      <CardContent className="space-y-4">
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
          <UILabel className="text-neutral-900">
            Catatan Untuk Kurir (Opsional)
          </UILabel>
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
            onChange={(e) =>
              formik.setFieldValue("phoneNumber", e.target.value)
            }
            className="h-11 rounded-xl bg-white border-neutral-300"
          />
        </div>

        <div className="space-y-2">
          <CardMap
            initial={{
              lat: formik.values.latitude,
              lng: formik.values.longitude,
              addressLine: formik.values.pinpoint,
              city: formik.values.city,
            }}
            onLocationSelect={(loc) => {
              formik.setFieldValue("latitude", loc.latitude);
              formik.setFieldValue("longitude", loc.longitude);
              formik.setFieldValue("pinpoint", loc.addressLine ?? "");
              formik.setFieldValue("city", loc.city ?? "");
              formik.setFieldValue("address", loc.addressLine ?? ""); // ← hapus guard
            }}
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

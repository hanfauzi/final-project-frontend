"use client";

import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, LoaderCircle, MapPin } from "lucide-react";

import PinpointDialog from "../../_components/PinPointDialog";
import { LabelChips } from "../../_components/LabelChips";
import { EditAddressCustomerSchema } from "@/features/customer/address/schema/validationCustomerEditAddressSchema";
// pakai schema yang sama dengan edit (rules-nya identik)
import useCreateCustomerAddress from "../../_hooks/useCreateAddress";
import type { LabelEnum } from "../../_hooks/useEditAddress";

export default function CreateAddressPage() {
  const router = useRouter();
  const { createAddressMutation } = useCreateCustomerAddress();

  const formik = useFormik<{
    label: LabelEnum;
    address: string;
    notes: string | null;
    city: string;
    postalCode: string;
    phoneNumber: string;
    latitude: number;
    longitude: number;
    pinpoint: string;     // UI only (preview text)
    makePrimary: boolean; // untuk toggle set primary
  }>({
    initialValues: {
      label: "HOME",
      address: "",
      notes: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
      latitude: 0,
      longitude: 0,
      pinpoint: "",
      makePrimary: false,
    },
    validationSchema: EditAddressCustomerSchema,
    onSubmit: async (values) => {
      try {
        await createAddressMutation.mutateAsync({
          label: values.label,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          phoneNumber: values.phoneNumber,
          latitude: values.latitude,
          longitude: values.longitude,
          notes: values.notes,
          isPrimary: values.makePrimary,
        });
        router.back(); // balik ke list
      } catch {
        // notifikasi sudah dihandle di hook
      }
    },
  });

  const coordsReady =
    Number.isFinite(formik.values.latitude) &&
    Number.isFinite(formik.values.longitude) &&
    (formik.values.latitude !== 0 || formik.values.longitude !== 0);

  return (
    <>
      <Head>
        <title>Tambah Alamat • Laundr</title>
      </Head>

      <div className="min-h-screen bg-neutral-50">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur border-b border-neutral-200">
          <div className="mx-auto max-w-2xl px-4 h-14 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="font-semibold text-neutral-900">Tambah Alamat</div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-4">
          <Card className="rounded-2xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.05)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-neutral-800">
                Detail Alamat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pinpoint (peta + geolocate) */}
              <PinpointDialog
                valueText={formik.values.pinpoint}
                lat={formik.values.latitude}
                lng={formik.values.longitude}
                onPick={({ latitude, longitude, display }) => {
                  formik.setFieldValue("latitude", latitude);
                  formik.setFieldValue("longitude", longitude);
                  if (display) formik.setFieldValue("pinpoint", display);
                }}
              />
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={[
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full",
                    coordsReady
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 text-neutral-700",
                  ].join(" ")}
                >
                  <MapPin className="h-3 w-3" />
                  {coordsReady ? "Koordinat tersimpan" : "Pilih titik di peta"}
                </span>
                {!coordsReady && (
                  <span className="text-neutral-500">
                    (wajib untuk simpan alamat)
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="space-y-2">
                <UILabel className="text-neutral-900">Label Alamat</UILabel>
                <LabelChips
                  value={formik.values.label}
                  onChange={(v) => formik.setFieldValue("label", v)}
                />
              </div>

              {/* Alamat Lengkap */}
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

              {/* Catatan Kurir (opsional) */}
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

              {/* City + Postal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    onChange={(e) =>
                      formik.setFieldValue("postalCode", e.target.value)
                    }
                    className="h-11 rounded-xl bg-white border-neutral-300"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <UILabel className="text-neutral-900">Nomor HP</UILabel>
                <Input
                  value={formik.values.phoneNumber}
                  onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
                  className="h-11 rounded-xl bg-white border-neutral-300"
                />
              </div>

              {/* Checkbox: Jadikan alamat utama */}
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

              <Separator />

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-neutral-300"
                  onClick={() => router.back()}
                  disabled={createAddressMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  onClick={() => formik.handleSubmit()}
                  className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
                  disabled={!formik.isValid || !coordsReady || createAddressMutation.isPending}
                >
                  {createAddressMutation.isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Menyimpan…
                    </span>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

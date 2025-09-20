"use client";

import { LabelChips } from "@/app/customer/_components/LabelChips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditAddressCustomerSchema } from "@/features/customer/address/schema/validationCustomerEditAddressSchema";
import { useFormik } from "formik";
import { ChevronLeft, LoaderCircle, MapPin } from "lucide-react";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import useEditCustomerAddress, { LabelEnum } from "../../_hooks/useEditAddress";
import useGetCustomerAddressById from "../../_hooks/useGetAddressById";
import { CustomerAddress } from "../../_hooks/useGetAddresses";
import useSetPrimaryCustomerAddress from "../../_hooks/useSetPrimaryAddress";
import CardMap from "@/app/customer/_components/CardMap";

function EditAddressPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { editAddressMutation } = useEditCustomerAddress(id);
  const { data, isLoading, isError } = useGetCustomerAddressById(id);
  const { setPrimaryMutation } = useSetPrimaryCustomerAddress(id);

  const initial: CustomerAddress | undefined = useMemo(() => (data ? data : undefined), [data]);

  const formik = useFormik<{
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
  }>({
    enableReinitialize: true,
    initialValues: initial
      ? {
          label: (initial.label as LabelEnum) ?? "HOME",
          address: initial.address ?? "",
          notes: initial.notes ?? "",
          city: initial.city ?? "",
          postalCode: initial.postalCode ?? "",
          phoneNumber: initial.phoneNumber ?? "",
          latitude: initial.latitude ?? 0,
          longitude: initial.longitude ?? 0,
          pinpoint: initial.address || [initial.city, initial.postalCode].filter(Boolean).join(", "),
          makePrimary: initial.isPrimary ?? false,
        }
      : {
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
        await editAddressMutation.mutateAsync({
          label: values.label,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          phoneNumber: values.phoneNumber,
          latitude: values.latitude,
          longitude: values.longitude,
          notes: values.notes,
        });

        if (values.makePrimary && !initial?.isPrimary) {
          await setPrimaryMutation.mutateAsync();
        }

        router.back();
      } catch {}
    },
  });

  const pending = editAddressMutation.isPending || setPrimaryMutation.isPending;

  const coordsReady =
    Number.isFinite(formik.values.latitude) &&
    Number.isFinite(formik.values.longitude) &&
    (formik.values.latitude !== 0 || formik.values.longitude !== 0);

  return (
    <>
      <Head><title>Ubah Alamat • Laundr</title></Head>

      <div className="relative min-h-screen bg-background">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-foreground">Ubah Alamat</div>
            <div className="ml-auto text-xs text-muted-foreground">
              {initial?.isPrimary ? "Alamat utama" : ""}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm px-4 py-4 pb-24">
          <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Detail Alamat</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {isLoading && (
                <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Memuat data…
                </div>
              )}
              {isError && <div className="text-sm text-destructive">Gagal mengambil alamat.</div>}

              <CardMap
                initial={{
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
                  formik.setFieldValue("latitude", loc.latitude);
                  formik.setFieldValue("longitude", loc.longitude);
                  formik.setFieldValue("pinpoint", loc.addressLine);
                  formik.setFieldValue("city", loc.city ?? "");
                  if (!formik.touched.address && !formik.values.address) {
                    formik.setFieldValue("address", loc.addressLine);
                  }
                }}
              />

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={[
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full",
                    coordsReady ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  <MapPin className="h-3 w-3" />
                  {coordsReady ? "Koordinat tersimpan" : "Pilih titik di peta"}
                </span>
                {!coordsReady && <span className="text-muted-foreground">(wajib untuk simpan alamat)</span>}
              </div>

              <div className="space-y-2">
                <UILabel className="text-foreground">Label Alamat</UILabel>
                <LabelChips value={formik.values.label} onChange={(v) => formik.setFieldValue("label", v)} />
                {formik.touched.label && formik.errors.label && (
                  <p className="text-xs text-destructive">{String(formik.errors.label)}</p>
                )}
              </div>

              <div className="space-y-2">
                <UILabel className="text-foreground">Alamat Lengkap</UILabel>
                <Textarea
                  placeholder="Nama jalan, nomor rumah, RT/RW, dsb"
                  value={formik.values.address}
                  onChange={(e) => formik.setFieldValue("address", e.target.value)}
                  className="min-h-24 rounded-xl bg-card border-border placeholder:text-muted-foreground focus-visible:ring-ring"
                  maxLength={200}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formik.values.address.length}/200
                </div>
                {formik.touched.address && formik.errors.address && (
                  <p className="text-xs text-destructive">{String(formik.errors.address)}</p>
                )}
              </div>

              <div className="space-y-2">
                <UILabel className="text-foreground">Catatan Untuk Kurir (Opsional)</UILabel>
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
                  value={formik.values.city}
                  onChange={(e) => formik.setFieldValue("city", e.target.value)}
                  className="h-11 rounded-xl bg-card border-border focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <UILabel className="text-foreground">Kode Pos</UILabel>
                <Input
                  value={formik.values.postalCode}
                  onChange={(e) => formik.setFieldValue("postalCode", e.target.value)}
                  className="h-11 rounded-xl bg-card border-border focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <UILabel className="text-foreground">Nomor HP</UILabel>
                <Input
                  value={formik.values.phoneNumber}
                  onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
                  className="h-11 rounded-xl bg-card border-border focus-visible:ring-ring"
                />
              </div>

              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="makePrimary"
                    checked={formik.values.makePrimary}
                    disabled={initial?.isPrimary === true}
                    onCheckedChange={(v) => formik.setFieldValue("makePrimary", Boolean(v))}
                  />
                  <UILabel htmlFor="makePrimary" className="text-sm">Jadikan alamat utama</UILabel>
                  {initial?.isPrimary && <span className="text-xs text-muted-foreground">(Alamat ini sudah utama)</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 py-3 grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => router.back()} disabled={pending}>
              Batal
            </Button>
            <Button
              type="submit"
              onClick={() => formik.handleSubmit()}
              className="h-12 rounded-xl disabled:opacity-60"
              disabled={!formik.isValid || !coordsReady || pending}
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Menyimpan…
                </span>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </>
  );
}

export default EditAddressPage;

"use client";

import { Button } from "@/components/ui/button";
import { EditAddressCustomerSchema } from "@/features/customer/address/schema/validationCustomerEditAddressSchema";
import { useFormik } from "formik";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import useCreateCustomerAddress from "../_hooks/useCreateAddress";
import type { LabelEnum } from "../_hooks/useEditAddress";
import CreateAddressFormCard from "../_components/CreateAddressFormCard";

function CreateAddressPage() {
  const router = useRouter();
  const { createAddressMutation } = useCreateCustomerAddress();

  const formik = useFormik<{
    label: LabelEnum; address: string; notes: string | null; city: string; postalCode: string;
    phoneNumber: string; latitude: number; longitude: number; pinpoint: string; makePrimary: boolean;
  }>({
    initialValues: {
      label: "HOME", address: "", notes: "", city: "", postalCode: "",
      phoneNumber: "", latitude: 0, longitude: 0, pinpoint: "", makePrimary: false,
    },
    validationSchema: EditAddressCustomerSchema,
    onSubmit: async (values) => {
      try {
        await createAddressMutation.mutateAsync({
          label: values.label, address: values.address, city: values.city,
          postalCode: values.postalCode, phoneNumber: values.phoneNumber,
          latitude: values.latitude, longitude: values.longitude, notes: values.notes,
          isPrimary: values.makePrimary,
        });
        router.back();
      } catch {}
    },
  });

  const pending = createAddressMutation.isPending;
  const coordsReady =
    Number.isFinite(formik.values.latitude) &&
    Number.isFinite(formik.values.longitude) &&
    (formik.values.latitude !== 0 || formik.values.longitude !== 0);

  return (
    <>
      <Head><title>Tambah Alamat • Laundr</title></Head>

      <div className="relative min-h-screen bg-transparent">
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur md:hidden">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-foreground">Tambah Alamat</div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="mx-auto w-full md:max-w-5xl md:px-6 md:pt-6">
            <h1 className="text-xl font-semibold text-foreground">Tambah Alamat</h1>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm px-4 py-4 pb-24 md:max-w-5xl md:px-6 md:py-6 md:pb-8">
          <CreateAddressFormCard formik={formik} coordsReady={coordsReady} />
        </div>

        <div className="sticky bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur md:static md:bg-transparent md:border-t-0">
          <div className="mx-auto w-full max-w-sm px-4 py-3 grid grid-cols-2 gap-2 md:max-w-5xl md:px-6 md:py-0 md:flex md:justify-end md:gap-3">
            <Button type="button" variant="outline" className="h-12 rounded-xl md:h-11" onClick={() => router.back()} disabled={pending}>
              Batal
            </Button>
            <Button
              type="submit"
              onClick={() => formik.handleSubmit()}
              className="h-12 rounded-xl disabled:opacity-60 md:h-11"
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
      </div>
    </>
  );
}

export default CreateAddressPage;

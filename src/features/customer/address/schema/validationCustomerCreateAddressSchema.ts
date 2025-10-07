import { LabelEnum } from "@/app/customer/(protected)/address/_hooks/useEditAddress";
import * as Yup from "yup";

export const CreateAddressCustomerSchema = Yup.object({
  label: Yup.mixed<LabelEnum>()
    .oneOf(["HOME", "OFFICE", "APARTMENT", "OTHER"])
    .required("Wajib dipilih"),
  address: Yup.string().min(5, "Min. 5 karakter").max(200, "Maks. 200").required("Wajib diisi"),
  notes: Yup.string().max(200, "Maks. 200").nullable(),
  city: Yup.string().min(2, "Min. 2 karakter").required("Wajib diisi"),
  postalCode: Yup.string().min(5, "Harus 5 digit").max(5, "Harus 5 digit").required("Wajib diisi"),
  phoneNumber: Yup.string().min(8, "Min. 8 digit").max(20, "Maks. 20 digit").required("Wajib diisi"),
  latitude: Yup.number().min(-90).max(90).required("Pilih titik di peta"),
  longitude: Yup.number().min(-180).max(180).required("Pilih titik di peta"),

  pinpoint: Yup.string().max(200, "Maks. 200").default(""),
  makePrimary: Yup.boolean().default(false),
});

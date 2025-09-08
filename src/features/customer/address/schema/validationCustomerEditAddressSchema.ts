import { LabelEnum } from "@/app/customer/address/_hooks/useEditAddress";
import * as Yup from "yup";

export const EditAddressCustomerSchema = Yup.object({
  label: Yup.mixed<LabelEnum>()
    .oneOf(["HOME", "OFFICE", "APARTMENT", "OTHER"])
    .required("Wajib dipilih"),
  address: Yup.string().min(5).max(200).required("Wajib diisi"),
  notes: Yup.string().max(200).nullable(),
  city: Yup.string().min(2).required("Wajib diisi"),
  postalCode: Yup.string().min(4).max(10).required("Wajib diisi"),
  phoneNumber: Yup.string().min(8).max(20).required("Wajib diisi"),
  latitude: Yup.number().min(-90).max(90).required(),
  longitude: Yup.number().min(-180).max(180).required(),
});

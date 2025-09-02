import * as Yup from "yup";

export const validationCustomerProfileSchema = Yup.object().shape({
  name: Yup.string().min(6, "Minimal 6 Karakter"),
  phoneNumber: Yup.string(),
  photoUrl: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Ukuran maksimum gambar adalah 1MB",
      (file) => !file || file.size <= 1 * 1024 * 1024
    )
    .test(
      "fileType",
      "Format gambar tidak didukung",
      (file) =>
        !file ||
        ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(
          file.type
        )
    ),
});

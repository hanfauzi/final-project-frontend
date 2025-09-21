import * as Yup from "yup";

export const validationSetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password tidak sesuai")
    .required("Konfirmasi password wajib diisi"),
});

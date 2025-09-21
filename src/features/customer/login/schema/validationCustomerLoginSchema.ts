import * as Yup from "yup";

export const validationCustomerLoginSchema = Yup.object().shape({
  email: Yup.string().required("Email wajib diisi").email("Email tidak valid"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password wajib diisi"),
});

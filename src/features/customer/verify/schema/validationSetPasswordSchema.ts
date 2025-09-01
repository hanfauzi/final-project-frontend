import * as Yup from "yup";

export const validationSetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters!")
    .required("Password is required!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password didn't match")
    .required("Password confirmation is required!"),
});

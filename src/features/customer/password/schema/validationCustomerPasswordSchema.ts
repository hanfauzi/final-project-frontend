import * as Yup from "yup";

export const validationEditPasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().min(8).required("Password lama diperlukan!"),
  newPassword: Yup.string().min(8).required("Passwrd baru diperlukan!"),
});
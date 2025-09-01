import * as Yup from "yup";

export const validationCustomerRegisterSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required!"),
});

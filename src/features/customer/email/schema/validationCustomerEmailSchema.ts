import * as Yup from "yup";

export const validationCustomerEmailSchema  = Yup.object().shape({
  email: Yup.string().email().required("Email is required!"),
});
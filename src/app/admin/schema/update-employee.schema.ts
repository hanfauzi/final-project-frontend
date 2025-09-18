import * as Yup from "yup";

export const updateEmployeeValidationSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  phoneNumber: Yup.string(),
  address: Yup.string(),
  role: Yup.string(),
  shiftId: Yup.string(),
  photoUrl: Yup.mixed(), 
  password: Yup.string().min(8, "Password must be at least 8 characters"),
});

export type UpdateEmployeeFormValues = Yup.InferType<typeof updateEmployeeValidationSchema>;

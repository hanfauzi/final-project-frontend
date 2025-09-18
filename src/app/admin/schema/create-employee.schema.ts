import * as Yup from "yup";

export const roles = ["SUPER_ADMIN", "OUTLET_ADMIN", "DRIVER", "WORKER"] as const;

export const employeeSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  phoneNumber: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  role: Yup.string().oneOf(roles as unknown as string[]).required("Role is required"),
  outletId: Yup.string().when("role", {
    is: (role: string) => role !== "SUPER_ADMIN",
    then: (schema) => schema.required("Outlet is required"),
    otherwise: (schema) => schema.optional(),
  }),
  shiftId: Yup.string().required("Shift ID is required"),
  photoUrl: Yup.mixed<File>()
    .test("fileSize", "File too large, max 2MB", (file) => {
      if (!file) return true; // optional
      return (file as File).size <= 2 * 1024 * 1024; // 2MB
    })
    .test("fileType", "Unsupported file format", (file) => {
      if (!file) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes((file as File).type);
    }),
});

export type EmployeeFormValues = Yup.InferType<typeof employeeSchema>;

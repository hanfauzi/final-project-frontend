import * as Yup from "yup";

export const CreateOutletSchema = Yup.object().shape({
  name: Yup.string()
    .max(60, "Name must not be longer than 60 characters")
    .required("Name is required"),
    code: Yup.string()
    .min(3, "Code must be 3 characters")
    .max(3, "Code must be 3 characters")
    .required("Code is required"),
  address: Yup.string()
    .max(200, "Address must not be longer than 200 characters")
    .required("Address is required"),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not be longer than 15 digits")
    .required("Phone number is required"),
  cityId: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal code is required"),
  latitude: Yup.number().required("Latitude is required. ex: -6.12345"),
  longitude: Yup.number().required("Longitude is required. ex: 106.12345"),
  coverageArea: Yup.number()
    .min(1, "Coverage area must be at least 1 km")
    .max(5, "Coverage area must not be more than 5 km")
    .required("Coverage area is required"),
});

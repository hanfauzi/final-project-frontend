"use client";

import { useFormik } from "formik";
import { validationCustomerProfileSchema } from "@/features/customer/profile/schema/validationCustomerProfileSchema";
import { validationCustomerEmailSchema } from "@/features/customer/email/schema/validationCustomerEmailSchema";
import type { CustomerProfile } from "@/types/customerProfile";
import useEditEmail from "../useEditEmail";
import useEditProfile, { EditProfilePayload } from "../useEditProfile";

export function useProfileForms(profile: CustomerProfile | null) {
  const { editProfileMutation } = useEditProfile();
  const { editEmailMutation } = useEditEmail();

  const profileFormik = useFormik<EditProfilePayload>({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name || "",
      phoneNumber: profile?.phoneNumber || "",
      photoUrl: null,
    },
    validationSchema: validationCustomerProfileSchema,
    onSubmit: (values) => {
      editProfileMutation.mutate(values);
    },
  });

  const emailFormik = useFormik<{ email: string }>({
    enableReinitialize: true,
    initialValues: { email: profile?.email || "" },
    validationSchema: validationCustomerEmailSchema,
    onSubmit: (values) => {
      editEmailMutation.mutate({ email: values.email });
    },
  });

  const hasErr = (k: keyof EditProfilePayload) =>
    Boolean(profileFormik.touched[k] && profileFormik.errors[k]);
  const hasErrEmail = Boolean(
    emailFormik.touched.email && emailFormik.errors.email
  );

  return {
    profileFormik,
    emailFormik,
    hasErr,
    hasErrEmail,
    pending: editProfileMutation.isPending,
    pendingEmail: editEmailMutation.isPending,
  };
}

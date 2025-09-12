"use client";

import { useEffect, useRef, useState } from "react";
import type { FormikContextType } from "formik";
import { EditProfilePayload } from "../useEditProfile";

type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;

export function useAvatar(
  formik: FormikContextType<EditProfilePayload>,
  initialPhotoUrl?: string | null
) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(initialPhotoUrl ?? "");

  useEffect(() => {
    const v = formik.values.photoUrl;
    if (v instanceof File) {
      const url = URL.createObjectURL(v);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(initialPhotoUrl ?? "");
  }, [formik.values.photoUrl, initialPhotoUrl]);

  const pickFile = () => fileRef.current?.click();

  const clearPhoto = () => {
    formik.setFieldValue("photoUrl", null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFileChange: ChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      alert("File harus berupa gambar (png, jpg, jpeg).");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 1MB.");
      return;
    }
    formik.setFieldValue("photoUrl", file);
  };

  return { fileRef, pickFile, clearPhoto, onFileChange, avatarSrc: preview };
}

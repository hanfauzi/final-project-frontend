import { Button } from "@/components/ui/button";
import { Camera, LoaderCircle, Pencil, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import useGetCustomerProfile from "../_hooks/useGetProfile";
import { CustomerProfile } from "@/types/customerProfile";
import { useMemo, useState } from "react";
import { useProfileForms } from "../_hooks/ui/useProfileForms";
import { useAvatar } from "../_hooks/ui/useAvatar";
import { makeInitials } from "@/app/customer/(protected)/profile/_components/MakeInitals";

export function AvatarForm() {
  const { data, isLoading, isError } = useGetCustomerProfile();
  const profile = (data ?? null) as CustomerProfile | null;
  const [isEditing, setIsEditing] = useState(false);

  const { profileFormik: formik, pending } = useProfileForms(profile);

  const { fileRef, pickFile, clearPhoto, onFileChange, avatarSrc } = useAvatar(
    formik,
    profile?.photoUrl ?? undefined
  );

  const initials = useMemo(
    () => makeInitials(profile?.name || profile?.email || "U"),
    [profile?.name, profile?.email]
  );

  return (
    <>
      <div className="grid place-items-center">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border border-border bg-card md:h-28 md:w-28 md:ring-1 md:ring-border/70">
          {avatarSrc ? (
            <Image src={avatarSrc} alt="Foto Profil" fill className="object-cover" sizes="120px" />
          ) : (
            <div className="h-full w-full grid place-items-center bg-muted text-muted-foreground text-2xl font-semibold md:text-3xl">
              {initials}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-3 grid w-full grid-cols-2 gap-2 md:gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={pickFile}
              disabled={pending}
              className="h-10 rounded-xl md:h-11"
            >
              <Camera className="h-4 w-4 mr-2" /> Ganti Foto
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={clearPhoto}
              disabled={pending}
              className="h-10 rounded-xl md:h-11"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Hapus
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        )}
      </div>

      {!isLoading && !isError && profile ? (
        !isEditing ? (
          <div className="mt-4 md:mt-5">
            <Button
              type="button"
              onClick={() => {
                formik.resetForm();
                setIsEditing(true);
              }}
              className="h-12 w-full rounded-xl md:h-12"
            >
              <Pencil className="h-4 w-4 mr-2" /> Ubah Profil
            </Button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => {
                setIsEditing(false);
                formik.resetForm();
                clearPhoto();
              }}
              className="h-12 rounded-xl md:h-12"
            >
              <X className="h-4 w-4 mr-2" /> Batal
            </Button>
            <Button
              type="button"
              onClick={() => formik.handleSubmit()}
              disabled={pending}
              className="h-12 rounded-xl md:h-12"
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Simpan
                </>
              )}
            </Button>
          </div>
        )
      ) : null}
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomerProfile } from "@/types/customerProfile";
import { LoaderCircle, Mail, Pencil, Phone, User } from "lucide-react";
import { useState } from "react";
import { useClipboardMap } from "../_hooks/ui/useClipboardMap";
import { useProfileForms } from "../_hooks/ui/useProfileForms";
import useGetCustomerProfile from "../_hooks/useGetProfile";

export function ProfileForm() {
  const { data, isLoading, isError, error } = useGetCustomerProfile();
  const profile = (data ?? null) as CustomerProfile | null;
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const {
    profileFormik: formik,
    emailFormik,
    hasErr,
    hasErrEmail,
    pending,
    pendingEmail,
  } = useProfileForms(profile);

  const { copied, copy } = useClipboardMap({ email: false, phone: false });

  return (
    <>
      {isLoading ? (
        <div className="py-14 grid place-items-center text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin mb-2" />
        </div>
      ) : isError ? (
        <div className="py-14 text-center text-destructive">
          Gagal memuat profil
          {error?.message ? `: ${error.message}` : "."}
        </div>
      ) : !profile ? (
        <div className="py-14 text-center text-muted-foreground">
          Profil tidak ditemukan.
        </div>
      ) : (
        <form
          onSubmit={formik.handleSubmit}
          className="mt-5 space-y-5 md:space-y-6"
          aria-busy={pending}
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground flex items-center gap-2 md:text-[15px]">
              <User className="h-4 w-4 text-muted-foreground" />
              Nama
            </Label>
            {!isEditing ? (
              <Input disabled value={profile.name ?? ""} className="h-11 md:h-12" />
            ) : (
              <>
                <Input
                  id="name"
                  type="text"
                  disabled={pending}
                  {...formik.getFieldProps("name")}
                  placeholder="Nama kamu"
                  className={`h-11 rounded-xl md:h-12 ${hasErr("name") ? "border-destructive" : ""}`}
                />
                {hasErr("name") && (
                  <p className="text-xs text-destructive" role="alert">
                    {formik.errors.name}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2 md:text-[15px]">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>

            {!isEditingEmail ? (
              <div className="flex items-center gap-2">
                <Input disabled value={profile.email ?? ""} className="h-11 md:h-12 flex-1 min-w-0" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => copy(profile.email, "email")}
                  className="h-9 rounded-lg md:h-10"
                >
                  {copied.email ? "Tersalin" : "Salin"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    formik.resetForm();
                    emailFormik.setFieldValue("email", profile.email ?? "");
                    setIsEditingEmail(true);
                  }}
                  className="h-9 rounded-lg md:h-10"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Ubah
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    type="email"
                    disabled={pendingEmail}
                    {...emailFormik.getFieldProps("email")}
                    placeholder="you@example.com"
                    className={`h-11 rounded-xl md:h-12 flex-1 min-w-0 ${hasErrEmail ? "border-destructive" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={pendingEmail}
                    onClick={() => {
                      setIsEditingEmail(false);
                      emailFormik.resetForm();
                    }}
                    className="h-9 rounded-lg md:h-10"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={pendingEmail}
                    onClick={() => emailFormik.handleSubmit()}
                    className="h-9 rounded-lg md:h-10"
                  >
                    {pendingEmail ? (
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                        Save
                      </span>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
                {hasErrEmail && (
                  <p className="text-xs text-destructive" role="alert">
                    {emailFormik.errors.email}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-foreground flex items-center gap-2 md:text-[15px]">
              <Phone className="h-4 w-4 text-muted-foreground" />
              No. Telepon
            </Label>
            {!isEditing ? (
              <div className="flex items-center gap-2">
                <Input disabled value={profile.phoneNumber ?? ""} className="h-11 md:h-12 flex-1 min-w-0" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={!profile.phoneNumber}
                  onClick={() => profile.phoneNumber && copy(profile.phoneNumber, "phone")}
                  className="h-9 rounded-lg disabled:opacity-50 md:h-10"
                >
                  {copied.phone ? "Tersalin" : "Salin"}
                </Button>
              </div>
            ) : (
              <>
                <Input
                  id="phoneNumber"
                  type="tel"
                  disabled={pending}
                  {...formik.getFieldProps("phoneNumber")}
                  placeholder="08xxxxxxxxxx"
                  className={`h-11 rounded-xl md:h-12 ${hasErr("phoneNumber") ? "border-destructive" : ""}`}
                />
                {hasErr("phoneNumber") && (
                  <p className="text-xs text-destructive" role="alert">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </>
            )}
          </div>

          {isEditing && (
            <p className="text-[11px] text-muted-foreground md:text-xs">
              Foto maksimal 1MB • Format: PNG/JPG/JPEG
            </p>
          )}
        </form>
      )}
    </>
  );
}

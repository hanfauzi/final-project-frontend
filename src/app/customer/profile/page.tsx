"use client";

import Head from "next/head";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LoaderCircle,
  Mail,
  Phone,
  User,
  Camera,
  Trash2,
  Save,
  X,
  Pencil,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { makeInitials } from "../_components/MakeInitals";
import useGetCustomerProfile from "../_hooks/useGetProfile";
import useEditProfile, { EditProfilePayload } from "../_hooks/useEditProfile";
import { validationCustomerProfileSchema } from "@/features/customer/profile/schema/validationCustomerProfileSchema";
import useEditEmail from "../_hooks/useEditEmail";
import { validationCustomerEmailSchema } from "@/features/customer/email/schema/validationCustomerEmailSchema";
import { CustomerProfile } from "@/types/customerProfile";
import { withAuthGuard } from "@/hoc/AuthGuard";

function CustomerProfilePage() {
  const { data, isLoading, isError, error } = useGetCustomerProfile();
  const profile = (data ?? null) as CustomerProfile | null;
  const { editProfileMutation } = useEditProfile();
  const pending = editProfileMutation.isPending;
  const { editEmailMutation } = useEditEmail();
  const pendingEmail = editEmailMutation.isPending;

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [copied, setCopied] = useState<{ email: boolean; phone: boolean }>({
    email: false,
    phone: false,
  });
  const fileRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik<EditProfilePayload>({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || "",
      phoneNumber: data?.phoneNumber || "",
      photoUrl: null,
    },
    validationSchema: validationCustomerProfileSchema,
    onSubmit: (values) => {
      editProfileMutation.mutate(values, {
        onSuccess: () => setIsEditing(false),
      });
    },
  });

  const hasErr = (k: keyof EditProfilePayload) =>
    Boolean(formik.touched[k] && formik.errors[k]);

  const emailFormik = useFormik<{ email: string }>({
    enableReinitialize: true,
    initialValues: { email: data?.email || "" },
    validationSchema: validationCustomerEmailSchema,
    onSubmit: (values) => {
      editEmailMutation.mutate(
        { email: values.email },
        { onSuccess: () => setIsEditingEmail(false) }
      );
    },
  });
  const hasErrEmail = Boolean(
    emailFormik.touched.email && emailFormik.errors.email
  );

  const avatarSrc = useMemo(() => {
    if (formik.values.photoUrl instanceof File) {
      return URL.createObjectURL(formik.values.photoUrl);
    }
    return profile?.photoUrl || "";
  }, [formik.values.photoUrl, profile?.photoUrl]);

  const initials = useMemo(
    () => makeInitials(profile?.name || profile?.email || "U"),
    [profile?.name, profile?.email]
  );

  const pickFile = () => fileRef.current?.click();
  const clearPhoto = () => {
    formik.setFieldValue("photoUrl", null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("File harus berupa gambar (png, jpg, jpeg, webp).");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 1MB.");
      return;
    }
    formik.setFieldValue("photoUrl", file);
  };

  const copy = async (text: string, which: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((s) => ({ ...s, [which]: true }));
      setTimeout(() => setCopied((s) => ({ ...s, [which]: false })), 1500);
    } catch {}
  };

  return (
    <>
      <Head>
        <title>Profil • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-neutral-50">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="mx-auto w-full max-w-sm px-4 py-6">
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neutral-900 text-white font-bold">
                L
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900">
                Laundr
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <CardHeader className="pb-0 text-center">
              <CardTitle className="text-lg font-semibold text-neutral-800">
                Profil
              </CardTitle>
              <p className="mt-1 text-sm text-neutral-500">
                Kelola informasi akunmu
              </p>
            </CardHeader>

            <CardContent className="pt-5">
              <div className="grid place-items-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border border-neutral-200 bg-white">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt="Foto Profil"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center bg-neutral-200 text-neutral-700 text-2xl font-semibold">
                      {initials}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-3 grid w-full grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={pickFile}
                      disabled={pending}
                      className="h-10 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                    >
                      <Camera className="h-4 w-4 mr-2" /> Ganti Foto
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={clearPhoto}
                      disabled={pending}
                      className="h-10 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
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
                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                        setIsEditing(true);
                      }}
                      className="h-12 w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99]"
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Edit Profil
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => {
                        setIsEditing(false);
                        formik.resetForm();
                        clearPhoto();
                      }}
                      className="h-12 rounded-xl"
                    >
                      <X className="h-4 w-4 mr-2" /> Batal
                    </Button>
                    <Button
                      type="button"
                      onClick={() => formik.handleSubmit()}
                      disabled={pending}
                      className="h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99]"
                    >
                      {pending ? (
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Menyimpan...
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

              {!isLoading && !isError && profile && (
                <div
                  className={`mt-5 flex items-start gap-3 rounded-xl border p-3 ${
                    profile.isVerified
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  {profile.isVerified ? (
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {profile.isVerified ? "Email verified" : "Email not verified"}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {profile.isVerified
                        ? "Your email address has been successfully verified."
                        : "Please verify your email to secure your account and unlock all features."}
                    </p>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="py-14 grid place-items-center text-neutral-600">
                  <LoaderCircle className="h-5 w-5 animate-spin mb-2" />
                  Memuat profil...
                </div>
              ) : isError ? (
                <div className="py-14 text-center text-red-600">
                  Gagal memuat profil
                  {error?.message ? `: ${error.message}` : "."}
                </div>
              ) : !profile ? (
                <div className="py-14 text-center text-neutral-600">
                  Profil tidak ditemukan.
                </div>
              ) : (
                <form
                  onSubmit={formik.handleSubmit}
                  className="mt-5 space-y-5"
                  aria-busy={pending}
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-neutral-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-neutral-500" />
                      Nama
                    </Label>
                    {!isEditing ? (
                      <Input disabled value={profile.name ?? ""} />
                    ) : (
                      <>
                        <Input
                          id="name"
                          type="text"
                          disabled={pending}
                          {...formik.getFieldProps("name")}
                          placeholder="Nama kamu"
                          className={`h-11 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
                            hasErr("name") ? "border-red-400" : ""
                          }`}
                        />
                        {hasErr("name") && (
                          <p className="text-xs text-red-500" role="alert">
                            {formik.errors.name}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-neutral-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-neutral-500" />
                      Email
                    </Label>

                    {!isEditingEmail ? (
                      <div className="flex items-center gap-2">
                        <Input disabled value={profile.email ?? ""} />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => copy(profile.email, "email")}
                          className="h-9 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                        >
                          {copied.email ? "Copied!" : "Copy"}
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
                          className="h-9 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
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
                            className={`h-11 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
                              hasErrEmail ? "border-red-400" : ""
                            }`}
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
                            className="h-9 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                          >
                            Batal
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            disabled={pendingEmail}
                            onClick={() => emailFormik.handleSubmit()}
                            className="h-9 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
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
                          <p className="text-xs text-red-500" role="alert">
                            {emailFormik.errors.email}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-neutral-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-neutral-500" />
                      No. Telepon
                    </Label>
                    {!isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input disabled value={profile.phoneNumber ?? ""} />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={!profile.phoneNumber}
                          onClick={() => profile.phoneNumber && copy(profile.phoneNumber, "phone")}
                          className="h-9 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-200 disabled:opacity-50"
                        >
                          {copied.phone ? "Copied!" : "Copy"}
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
                          className={`h-11 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 focus-visible:ring-neutral-900 ${
                            hasErr("phoneNumber") ? "border-red-400" : ""
                          }`}
                        />
                        {hasErr("phoneNumber") && (
                          <p className="text-xs text-red-500" role="alert">
                            {formik.errors.phoneNumber}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <p className="text-[11px] text-neutral-500">
                      Foto maksimal 1MB • Format: PNG/JPG/JPEG/WEBP
                    </p>
                  )}
                </form>
              )}
            </CardContent>
          </Card>

          <div className="h-6" />
        </div>
      </div>
    </>
  );
}

export default withAuthGuard(CustomerProfilePage, {
  principal: "CUSTOMER",
  redirectToLoginCustomer: "/customer/login",
  superAdminCanAccessCustomer: true,
});

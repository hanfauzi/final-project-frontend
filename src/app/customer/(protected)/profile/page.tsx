"use client";

import { useFormik } from "formik";
import {
  Camera,
  ChevronLeft,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  Save,
  Trash2,
  User,
  Lock,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validationCustomerEmailSchema } from "@/features/customer/email/schema/validationCustomerEmailSchema";
import { validationCustomerProfileSchema } from "@/features/customer/profile/schema/validationCustomerProfileSchema";
import { CustomerProfile } from "@/types/customerProfile";
import { useRouter } from "next/navigation";
import { VerifiedForm } from "./_components/VerifiedForm";
import useEditEmail from "./_hooks/useEditEmail";
import useEditProfile, { EditProfilePayload } from "./_hooks/useEditProfile";
import useGetCustomerProfile from "./_hooks/useGetProfile";
import useEditPassword from "./_hooks/useEditPassword";
import { validationEditPasswordSchema } from "@/features/customer/password/schema/validationCustomerPasswordSchema";

function useClipboardMap<K extends string>(initial: Record<K, boolean>) {
  const [copied, setCopied] = useState<Record<K, boolean>>(initial);
  const copy = async (text: string, key: K, timeoutMs = 1500) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((s) => ({ ...s, [key]: true }));
      setTimeout(() => setCopied((s) => ({ ...s, [key]: false })), timeoutMs);
    } catch {}
  };
  return { copied, copy, setCopied };
}

type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
function useAvatar(
  formik: ReturnType<typeof useFormik<EditProfilePayload>>,
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

  return { fileRef, pickFile, clearPhoto, onFileChange, avatarSrc: preview };
}

export default function CustomerProfilePage() {
  const router = useRouter();

  const { data, isLoading, isError, error } = useGetCustomerProfile();
  const profile = (data ?? null) as CustomerProfile | null;

  const { editProfileMutation } = useEditProfile();
  const { editEmailMutation } = useEditEmail();
  const { editPasswordMutation } = useEditPassword();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const profileFormik = useFormik<EditProfilePayload>({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name || "",
      phoneNumber: profile?.phoneNumber || "",
      photoUrl: null,
    },
    validationSchema: validationCustomerProfileSchema,
    onSubmit: (values) => {
      editProfileMutation.mutate(values, {
        onSuccess: () => setIsEditingProfile(false),
      });
    },
  });
  const hasErr = (k: keyof EditProfilePayload) =>
    Boolean(profileFormik.touched[k] && profileFormik.errors[k]);
  const pendingProfile = editProfileMutation.isPending;

  const emailFormik = useFormik<{ email: string }>({
    enableReinitialize: true,
    initialValues: { email: profile?.email || "" },
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
  const pendingEmail = editEmailMutation.isPending;

  const passwordFormik = useFormik<{
    oldPassword: string;
    newPassword: string;
  }>({
    enableReinitialize: false,
    initialValues: { oldPassword: "", newPassword: "" },
    validationSchema: validationEditPasswordSchema,
    onSubmit: (values, { resetForm }) => {
      editPasswordMutation.mutate(values, {
        onSuccess: () => {
          setIsEditingPassword(false);
          resetForm();
        },
      });
    },
  });
  type PasswordKey = "oldPassword" | "newPassword";
  const hasErrPassword = (k: PasswordKey) =>
    Boolean(passwordFormik.touched[k] && passwordFormik.errors[k]);
  const pendingPassword = editPasswordMutation.isPending;

  const { fileRef, pickFile, clearPhoto, onFileChange, avatarSrc } = useAvatar(
    profileFormik,
    profile?.photoUrl ?? undefined
  );

  const { copied, copy } = useClipboardMap({ email: false, phone: false });

  return (
    <>
      <Head>
        <title>Profile • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-transparent md:bg-transparent">
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur md:hidden">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-foreground">
              Profil
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="mx-auto w-full md:max-w-5xl md:px-6">
            <h1 className="text-xl font-semibold text-foreground">Profil</h1>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm px-4 py-4 pb-24 md:max-w-5xl md:px-6 md:py-8">
          <Card className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,.06)] md:rounded-3xl md:shadow-xl">
            <CardContent className="pt-5 md:p-6">
              {isLoading ? (
                <div className="py-10 grid place-items-center text-muted-foreground">
                  <LoaderCircle className="h-5 w-5 animate-spin mb-2" />
                </div>
              ) : isError ? (
                <div className="py-10 text-center text-destructive">
                  Gagal memuat profil
                  {error?.message ? `: ${error.message}` : "."}
                </div>
              ) : !profile ? (
                <div className="py-10 text-center text-muted-foreground">
                  Profil tidak ditemukan.
                </div>
              ) : (
                <>
                  <div className="grid place-items-center">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border border-border bg-card md:h-28 md:w-28 md:ring-1 md:ring-border/70">
                      <Image
                        src={avatarSrc || "/profile-default.jpg"}
                        alt="Foto Profil"
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 112px, 96px"
                        priority
                      />
                    </div>

                    {isEditingProfile && (
                      <div className="mt-3 grid w-full grid-cols-2 gap-2 md:gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={pickFile}
                          disabled={pendingProfile}
                          className="h-10 rounded-xl md:h-11"
                        >
                          <Camera className="h-4 w-4 mr-2" /> Ganti Foto
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={clearPhoto}
                          disabled={pendingProfile}
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

                  <div className="mt-3 grid w-full grid-cols-2 gap-2 md:gap-3">
                    {!isEditingProfile ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          profileFormik.resetForm();
                          setIsEditingProfile(true);
                        }}
                        className="h-9 col-span-2 rounded-lg md:h-10"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit Profil
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={pendingProfile}
                          onClick={() => {
                            setIsEditingProfile(false);
                            profileFormik.resetForm();
                            clearPhoto();
                          }}
                          className="h-9 rounded-lg md:h-10"
                        >
                          Batal
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={pendingProfile}
                          onClick={() => profileFormik.handleSubmit()}
                          className="h-9 rounded-lg md:h-10"
                        >
                          {pendingProfile ? (
                            <span className="inline-flex items-center gap-2">
                              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                              Simpan
                            </span>
                          ) : (
                            <>
                              <Save className="h-3.5 w-3.5 mr-1" />
                              Simpan
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    <VerifiedForm />
                  </div>

                  <div className="mt-5 md:mt-6">
                    <Tabs defaultValue="profile">
                      <TabsList className="grid w-full grid-cols-2 rounded-xl md:w-auto md:inline-flex">
                        <TabsTrigger value="profile">Data Diri</TabsTrigger>
                        <TabsTrigger value="account">Akun</TabsTrigger>
                      </TabsList>

                      <TabsContent value="profile" className="mt-4">
                        <form
                          onSubmit={profileFormik.handleSubmit}
                          className="space-y-5 md:space-y-6"
                          aria-busy={pendingProfile}
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-foreground flex items-center gap-2 md:text-[15px]"
                            >
                              <User className="h-4 w-4 text-muted-foreground" />
                              Nama
                            </Label>
                            {!isEditingProfile ? (
                              <Input
                                disabled
                                value={profile.name ?? ""}
                                className="h-11 md:h-12"
                              />
                            ) : (
                              <>
                                <Input
                                  id="name"
                                  type="text"
                                  disabled={pendingProfile}
                                  {...profileFormik.getFieldProps("name")}
                                  placeholder="Nama kamu"
                                  className={`h-11 rounded-xl md:h-12 ${
                                    hasErr("name") ? "border-destructive" : ""
                                  }`}
                                />
                                {hasErr("name") && (
                                  <p
                                    className="text-xs text-destructive"
                                    role="alert"
                                  >
                                    {profileFormik.errors.name}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="phoneNumber"
                              className="text-foreground flex items-center gap-2 md:text-[15px]"
                            >
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              No. Telepon
                            </Label>
                            {!isEditingProfile ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  disabled
                                  value={profile.phoneNumber ?? ""}
                                  className="h-11 md:h-12 flex-1 min-w-0"
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  disabled={!profile.phoneNumber}
                                  onClick={() =>
                                    profile.phoneNumber &&
                                    copy(profile.phoneNumber, "phone")
                                  }
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
                                  disabled={pendingProfile}
                                  {...profileFormik.getFieldProps(
                                    "phoneNumber"
                                  )}
                                  placeholder="08xxxxxxxxxx"
                                  className={`h-11 rounded-xl md:h-12 ${
                                    hasErr("phoneNumber")
                                      ? "border-destructive"
                                      : ""
                                  }`}
                                />
                                {hasErr("phoneNumber") && (
                                  <p
                                    className="text-xs text-destructive"
                                    role="alert"
                                  >
                                    {profileFormik.errors.phoneNumber}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          {isEditingProfile && (
                            <p className="text-[11px] text-muted-foreground md:text-xs">
                              Foto maksimal 1MB • Format: PNG/JPG/JPEG/WEBP
                            </p>
                          )}
                        </form>
                      </TabsContent>

                      <TabsContent value="account" className="mt-4">
                        <div className="mt-1">
                          <Label className="text-foreground flex items-center gap-2 md:text-[15px]">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email
                          </Label>

                          {!isEditingEmail ? (
                            <div className="mt-2 flex items-center gap-2">
                              <Input
                                disabled
                                value={profile.email ?? ""}
                                className="h-11 md:h-12 flex-1 min-w-0"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  profile.email && copy(profile.email, "email")
                                }
                                className="h-9 rounded-lg md:h-10"
                              >
                                {copied.email ? "Tersalin" : "Salin"}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  setIsEditingProfile(false);
                                  profileFormik.resetForm();

                                  emailFormik.setFieldValue(
                                    "email",
                                    profile.email ?? ""
                                  );
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
                              <div className="mt-2 flex items-center gap-2">
                                <Input
                                  id="email"
                                  type="email"
                                  disabled={pendingEmail}
                                  {...emailFormik.getFieldProps("email")}
                                  placeholder="you@example.com"
                                  className={`h-11 rounded-xl md:h-12 flex-1 min-w-0 ${
                                    hasErrEmail ? "border-destructive" : ""
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
                                  className="h-9 rounded-lg md:h-10"
                                >
                                  Batal
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      type="button"
                                      size="sm"
                                      disabled={pendingEmail}
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
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Ubah alamat email?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Kami akan menyimpan email baru ini. Anda
                                        harus memverifikasi email baru Anda
                                        setelah mengubahnya.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Batal
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          emailFormik.handleSubmit()
                                        }
                                        disabled={pendingEmail}
                                      >
                                        Simpan
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                              {hasErrEmail && (
                                <p
                                  className="text-xs text-destructive mt-1"
                                  role="alert"
                                >
                                  {emailFormik.errors.email}
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        <div className="mt-5">
                          <Label className="text-foreground flex items-center gap-2 md:text-[15px]">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            Password
                          </Label>

                          {!isEditingPassword ? (
                            <div className="mt-2 flex items-center gap-2">
                              <Input
                                disabled
                                value="••••••••"
                                className="h-11 md:h-12 flex-1 min-w-0"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  setIsEditingEmail(false);
                                  emailFormik.resetForm();
                                  setIsEditingPassword(true);
                                }}
                                className="h-9 rounded-lg md:h-10"
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Ubah
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="mt-5 grid gap-3 md:gap-3">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="oldPassword"
                                    className="text-foreground md:text-[15px]"
                                  >
                                    Password Lama
                                  </Label>
                                  <Input
                                    id="oldPassword"
                                    type="password"
                                    disabled={pendingPassword}
                                    {...passwordFormik.getFieldProps(
                                      "oldPassword"
                                    )}
                                    placeholder="Masukkan password lama"
                                    className={`h-11 rounded-xl md:h-12 ${
                                      hasErrPassword("oldPassword")
                                        ? "border-destructive"
                                        : ""
                                    }`}
                                  />
                                  {hasErrPassword("oldPassword") && (
                                    <p
                                      className="text-xs text-destructive"
                                      role="alert"
                                    >
                                      {
                                        passwordFormik.errors
                                          .oldPassword as string
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor="newPassword"
                                    className="text-foreground md:text-[15px]"
                                  >
                                    Password Baru
                                  </Label>
                                  <Input
                                    id="newPassword"
                                    type="password"
                                    disabled={pendingPassword}
                                    {...passwordFormik.getFieldProps(
                                      "newPassword"
                                    )}
                                    placeholder="Masukkan password baru"
                                    className={`h-11 rounded-xl md:h-12 ${
                                      hasErrPassword("newPassword")
                                        ? "border-destructive"
                                        : ""
                                    }`}
                                  />
                                  {hasErrPassword("newPassword") && (
                                    <p
                                      className="text-xs text-destructive"
                                      role="alert"
                                    >
                                      {
                                        passwordFormik.errors
                                          .newPassword as string
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    disabled={pendingPassword}
                                    onClick={() => {
                                      setIsEditingPassword(false);
                                      passwordFormik.resetForm();
                                    }}
                                    className="h-9 rounded-lg md:h-10"
                                  >
                                    Batal
                                  </Button>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        type="button"
                                        size="sm"
                                        disabled={pendingPassword || !passwordFormik.isValid || !passwordFormik.dirty}
                                        className="h-9 rounded-lg md:h-10"
                                      >
                                        {pendingPassword ? (
                                          <span className="inline-flex items-center gap-2">
                                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                            Save
                                          </span>
                                        ) : (
                                          "Save"
                                        )}
                                      </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Ubah password?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Kami akan menyimpan password baru
                                          Anda. Pastikan password lama sudah
                                          benar.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            passwordFormik.handleSubmit()
                                          }
                                          disabled={pendingPassword || !passwordFormik.isValid || !passwordFormik.dirty}
                                        >
                                          Simpan
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface EditProfilePayload {
  name?: string;
  phoneNumber?: string;
  photoUrl?: File | null;
}

export default function useEditProfile() {
  const queryClient = useQueryClient();


  const editProfileMutation = useMutation({
    mutationFn: async (payload: EditProfilePayload) => {
      const formData = new FormData();
      if (payload.name) formData.append("name", payload.name);
      if (payload.phoneNumber)
        formData.append("phoneNumber", payload.phoneNumber);
      if (payload.photoUrl) formData.append("photoUrl", payload.photoUrl);

      await axiosInstance.patch<EditProfilePayload>("/api/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil berhasil diperbarui!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal memperbarui profil.");
    },
  });

  return { editProfileMutation };
}

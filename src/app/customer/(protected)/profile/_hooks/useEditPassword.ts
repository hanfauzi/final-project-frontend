import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface EditPasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export default function useEditPassword() {
  const editPasswordMutation = useMutation({
    mutationFn: async (payload: EditPasswordPayload) => {
      const { data } = await axiosInstance.patch<EditPasswordPayload>(
        "/api/profile/edit/password",
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Kata sandi berhasil diperbarui!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal memperbarui email");
    },
  });

  return { editPasswordMutation };
}

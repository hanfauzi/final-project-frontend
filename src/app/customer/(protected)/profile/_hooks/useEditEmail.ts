import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface EditEmailPayload {
  email?: string;
}

export default function useEditEmail() {
  const queryClient = useQueryClient();

  const editEmailMutation = useMutation({
    mutationFn: async (payload: EditEmailPayload) => {
      const { data } = await axiosInstance.patch<EditEmailPayload>(
        "/api/profile/edit/email",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(
        "Email berhasil diperbarui! Silakan verifikasi email baru Anda",
      );
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal memperbarui email");
    },
  });

  return { editEmailMutation };
}

import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface SendEmailPayload {
  email: string;
}

export default function useSendResetPasswordEmail() {


  const sendResetPasswordEmailMutation = useMutation({
    mutationFn: async (payload: SendEmailPayload) => {
      await axiosInstance.post<SendEmailPayload>("/api/auth/customer/reset-password", payload, {skipAuth: true}
      );
    },
    onSuccess: () => {
      toast.success("Email reset password berhasil dikirim. Silakan periksa email Anda!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal mengirim email reset password.");
    },
  });

  return { sendResetPasswordEmailMutation };
}

import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface SendEmailPayload {
  email: string;
}

export default function useResendVerifyEmail() {


  const resendVerifyEmailMutation = useMutation({
    mutationFn: async (payload: SendEmailPayload) => {
      await axiosInstance.post<SendEmailPayload>("/api/auth/customer/resend", payload, {skipAuth: true}
      );
    },
    onSuccess: () => {
      toast.success( "Email verifikasi berhasil dikirim ulang. Silakan periksa email Anda!" );
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal mengirim ulang email verifikasi");
    },
  });

  return {  resendVerifyEmailMutation };
}

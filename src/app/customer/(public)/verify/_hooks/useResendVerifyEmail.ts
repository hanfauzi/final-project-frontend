import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface SendEmailPayload {
  email: string;
}

export default function useResendVerifyEmail() {
const router = useRouter();

  const resendVerifyEmailMutation = useMutation({
    mutationFn: async (payload: SendEmailPayload) => {
      await axiosInstance.post<SendEmailPayload>("/api/auth/customer/resend", payload, {skipAuth: true}
      );
    },
    onSuccess: () => {
      toast.success( "Email verifikasi berhasil dikirim ulang. Silakan periksa email Anda!" );
      router.refresh()
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal mengirim ulang email verifikasi");
    },
  });

  return {  resendVerifyEmailMutation };
}

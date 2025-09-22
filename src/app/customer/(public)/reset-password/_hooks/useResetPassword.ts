import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export interface ResetPasswordPayload {
  password: string;
}

export default function useResetPassword() {
  const params = useParams();
  const token = params.token;
  const router = useRouter();

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      await axiosInstance.post<ResetPasswordPayload>(
        `/api/auth/customer/reset-password-by/${token}`,
        payload, {skipAuth: true}
      );
    },
    onSuccess: () => {
      toast.success(
        "Reset password berhasil. Silakan login dengan password baru Anda"
      );
       router.refresh()
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal mereset password.");
    },
  });

  return { resetPasswordMutation };
}

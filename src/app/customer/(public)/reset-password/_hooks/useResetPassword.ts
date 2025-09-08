import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export interface ResetPasswordPayload {
  password: string;
}

export default function useResetPassword() {
  const params = useParams();
  const token = params.token;

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      await axiosInstance.post<ResetPasswordPayload>(
        `/api/auth/customer/reset-password-by/${token}`,
        payload
      );
    },
    onSuccess: () => {
      toast.success(
        "Reset password succesfully! You can login with your new password!"
      );
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  return { resetPasswordMutation };
}

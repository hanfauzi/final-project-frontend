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
      await axiosInstance.post<SendEmailPayload>("/api/auth/customer/resend", payload
      );
    },
    onSuccess: () => {
      toast.success( "Verification email resent. Please verify your account! The link has been sent to your email");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Resend email failed!");
    },
  });

  return {  resendVerifyEmailMutation };
}

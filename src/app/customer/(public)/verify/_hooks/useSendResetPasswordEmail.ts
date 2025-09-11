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
      toast.success("Reset password link has been sent to your email!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  return { sendResetPasswordEmailMutation };
}

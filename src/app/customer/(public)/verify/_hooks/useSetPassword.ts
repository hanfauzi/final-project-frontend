import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export interface SetPasswordPayload {
  password: string;
}

export default function useSetPassword() {
  const params = useParams();
  const verifyToken = params.token;

  const setPasswordMutation = useMutation({
    mutationFn: async (payload: SetPasswordPayload) => {
      await axiosInstance.post<SetPasswordPayload>(
        `/api/auth/customer/set-password/${verifyToken}`,
        payload, {skipAuth: true}
      );
    },
    onSuccess: () => {
      toast.success("Atur password berhasil. Silakan login dengan password baru Anda");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal mengatur password");
    },
  });

  return { setPasswordMutation };
}

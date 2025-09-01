import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisterPayload {
  email: string;
}

const useRegisterHook = () => {
  const router = useRouter();

  const registerCustomerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await axiosInstance.post<RegisterPayload>(
        "/api/auth/customer/register",
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Register success");
      router.replace("/customer/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  return {
    registerCustomerMutation,
  };
};

export default useRegisterHook;

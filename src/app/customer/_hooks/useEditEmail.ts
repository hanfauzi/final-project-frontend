import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface EditEmailPayload {
  email?: string;
}

export default function useEditEmail() {
  const queryClient = useQueryClient();
  const { customer } = useAuthStore();

  const editEmailMutation = useMutation({
    mutationFn: async (payload: EditEmailPayload) => {
     

      const {data } =await axiosInstance.patch<EditEmailPayload>("/api/profile/edit/email", payload, {
        headers: {
          Authorization: `Bearer ${customer?.token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Update email successfully! Please check your email to verify");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  return { editEmailMutation };
}

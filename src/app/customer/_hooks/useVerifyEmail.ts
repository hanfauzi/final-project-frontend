import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type VerifyResponse = { message: string };

export default function useVerifyEmail() {
  return useMutation<VerifyResponse, AxiosError<{ message: string }>, string>({
    mutationFn: async (token: string) => {
      const { data } = await axiosInstance.post<VerifyResponse>(
        `/api/profile/email/${token}`
      );
      return data;
    },
  });
}

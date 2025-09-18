import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function useConfirmationOrder() {
const router = useRouter();
    const queryClient = useQueryClient();

    const confirmationOrderMutation = useMutation({
        mutationFn: async (orderId: string) => {
            const {data}= await axiosInstance.patch(`/api/order/confirm/${orderId}`);
            return data;
        },
        onSuccess: (res, orderId) => {
            toast.success(res?.message ?? "Order berhasil dikonfirmasi.");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            router.replace("/customer/order");
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            toast.error(err.response?.data?.message ?? "Gagal mengkonfirmasi order.");
        }
    });
    return {confirmationOrderMutation};
}
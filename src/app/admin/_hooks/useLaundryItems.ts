import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface LaundryItems {
  id: string;
  name: string;
}

export interface CreateLaundryItem {
    name: string;
}

export interface UpdateLaundryItem {
  id: string;
  data : {
    name: string
  }
}

export function useLaundryItems() {
  return useQuery({
    queryKey: ["laundry-items"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/laundry-items");
      return res.data.data
    },
  });
}

export function useCreateLaundryItem() {
    const queryClient = useQueryClient()
    return useMutation({
    mutationFn: async (data: CreateLaundryItem) => {
      const res = await axiosInstance.post("/api/admin/laundry-items", data);
      return res.data;
    },
    onSuccess: () => {
        toast.success("New laundry item created successfully!")
      queryClient.invalidateQueries({ queryKey: ["laundry-items"] });
    },
  });
}

export function useUpdateLaundryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: UpdateLaundryItem) => {
      const res = await axiosInstance.patch(`/api/admin/laundry-items/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laundry-items"] });
    },
  });
}

export function useDeleteLaundryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/api/admin/laundry-items/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laundry-items"] });
    },
  });
}

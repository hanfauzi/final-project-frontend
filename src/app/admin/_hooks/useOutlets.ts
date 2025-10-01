import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface Outlet {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  cityId: string;
  cityName? : string
  postalCode: string
  isActive?: boolean;
  latitude: number
  longitude: number;
  coverageArea: number;

}
interface Meta {
  total: number;
  page: number;
  limit: number;
}

interface GetOutletsResponse {
  data: Outlet[];
  message: string;
}
interface GetPaginatedOutletsResponse {
  data: Outlet[];
  message: string;
  meta: Meta;
}

export function useOutlets() {
  return useQuery<Outlet[]>({
    queryKey: ["outlets"],
    queryFn: async () => {
      const res = await axiosInstance.get<GetOutletsResponse>(
        "/api/admin/outlets"
      );
      return res.data.data;
    },
  });
}

export function usePaginatedOutlets(params: {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  return useQuery({
    queryKey: ["outlets", params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetPaginatedOutletsResponse>(
        "/api/admin/outlets",
        { params }
      );
      return res.data;
    },
  });
}

export const useOutlet = (id: string) => {
  return useQuery<Outlet>({
    queryKey: ["outlet", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/admin/outlets/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateOutlet = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: Partial<Outlet>) => {
      const res = await axiosInstance.post("/api/admin/outlets", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
      toast.success("Outlet created successfully!");
      router.replace("/admin/outlets");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to create outlet");
    },
  });
};

export const useUpdateOutlet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Outlet> }) => {
      const res = await axiosInstance.patch(`/api/admin/outlets/${id}`, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
      queryClient.invalidateQueries({ queryKey: ["outlet", id] });
      toast.success(`Outlet updated sucessfully!`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Update outlet failed");
    },
  });
};

export const useDeleteOutlet = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/api/admin/outlets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
      toast.success("Outlet deleted successfully!");
      router.replace("/admin/outlets");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Delete outlet failed");
    },
  });
};

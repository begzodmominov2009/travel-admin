import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// ================= GET =================
export const useGet = (key, endpoint, params = {}, options = {}) => {
  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      const { data } = await api.get(`/${endpoint}`, { params });
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

// ================= POST =================
export const usePost = (endpoint, keyToInvalidate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post(`/${endpoint}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keyToInvalidate] });
    },
  });
};

// ================= PATCH =================
export const usePatch = (endpoint, keyToInvalidate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }) => {
      const { data } = await api.patch(`/${endpoint}/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keyToInvalidate] });
    },
  });
};

// ================= DELETE =================
export const useDelete = (endpoint, keyToInvalidate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/${endpoint}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keyToInvalidate] });
    },
  });
};

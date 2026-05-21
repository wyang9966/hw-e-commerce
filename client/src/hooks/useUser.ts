import { useQuery, useMutation } from "@tanstack/react-query";
import { userAPI } from "../lib/api/user";
import type { AuthUser } from "../types/auth";

export const useProfile = (username: string | undefined) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => (username ? userAPI.getProfile(username) : Promise.reject()),
    enabled: !!username,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (user: AuthUser) => userAPI.updateProfile(user),
  });
};

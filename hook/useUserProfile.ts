import { getUserProfile } from "@/service/profile.service";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });
}

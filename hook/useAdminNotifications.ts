import { useQuery } from "@tanstack/react-query";
import { getAdminNotifications } from "@/service/admin-notification.service";

export function useAdminNotifications() {
  return useQuery({
    queryKey: ["admin-notifications"],
    queryFn: getAdminNotifications,
    staleTime: 60 * 1000,
  });
}

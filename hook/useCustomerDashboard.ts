import { useQuery } from "@tanstack/react-query";
import { getCustomerDashboardData } from "@/service/customer-dashboard.service";

export function useCustomerDashboard() {
  return useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: getCustomerDashboardData,
    staleTime: 5 * 60 * 1000,
  });
}

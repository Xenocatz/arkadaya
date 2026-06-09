"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { getCurrentAuthProfile } from "@/service/auth.service";

const PUBLIC_ROUTES: ReadonlySet<string> = new Set([
  CUSTOMER_ROUTES.landing,
  "/u-dashboard/login",
  "/u-dashboard/register",
]);

export default function CustomerAuthGate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    const validateAccess = async () => {
      const isPublicRoute = PUBLIC_ROUTES.has(pathname);
      const result = await getCurrentAuthProfile();

      if (!isActive) return;

      if (!result.success) {
        if (!isPublicRoute) {
          router.replace(CUSTOMER_ROUTES.login);
          return;
        }

        setIsReady(true);
        return;
      }

      const role = result.data?.role;

      if (role === "admin") {
        router.replace("/a-dashboard");
        return;
      }

      if (isPublicRoute) {
        router.replace(CUSTOMER_ROUTES.order);
        return;
      }

      setIsReady(true);
    };

    void validateAccess();

    return () => {
      isActive = false;
    };
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fa] text-sm font-semibold text-[#0a315c]">
        Memuat sesi...
      </div>
    );
  }

  return <>{children}</>;
}

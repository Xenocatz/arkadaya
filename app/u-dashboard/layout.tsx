import type { ReactNode } from "react";
import CustomerAuthGate from "@/components/customer/CustomerAuthGate";

export default function CustomerDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div style={{ fontFamily: "var(--font-poppins)" }}>
      <CustomerAuthGate>{children}</CustomerAuthGate>
    </div>
  );
}

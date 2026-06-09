import type { ReactNode } from "react";
import { Poppins } from "next/font/google";
import CustomerAuthGate from "@/components/customer/CustomerAuthGate";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function CustomerDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className={poppins.className}>
      <CustomerAuthGate>{children}</CustomerAuthGate>
    </div>
  );
}

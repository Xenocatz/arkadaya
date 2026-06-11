"use client";

import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { useCustomerDashboard } from "@/hook/useCustomerDashboard";

export default function NotificationPage() {
  const { data, isLoading, isError } = useCustomerDashboard();
  const notifications = data?.notifications ?? [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-0 sm:p-4 md:p-8">
      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col justify-between overflow-hidden border border-slate-100 bg-white transition-all duration-500 sm:my-4 sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] sm:shadow-2xl">
        <div className="shrink-0 select-none border-b border-slate-50 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <svg
                className="h-8 w-8 text-[#05336b]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-[#05336b]">
                  ARKADAYA
                </span>
                <span className="mt-[-2px] text-[7.5px] font-bold tracking-wider text-[#f07f1b]">
                  EXPRESS LOGISTICS
                </span>
              </div>
            </div>

            <Link
              href={CUSTOMER_ROUTES.profile}
              className="rounded-full p-1 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#05336b]/10 text-[#05336b]">
                <User size={20} className="fill-[#05336b]" />
              </div>
            </Link>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto py-2">
          <div className="mb-6 mt-2 flex items-center gap-3 px-6">
            <Link
              href={CUSTOMER_ROUTES.order}
              className="rounded-full p-1.5 text-[#05336b] transition-all hover:bg-slate-100"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <h1 className="text-[32px] font-extrabold leading-none text-[#05336b]">
              Notification
            </h1>
          </div>

          <div className="space-y-5 px-6 pb-6">
            {isLoading ? (
              <div className="rounded-[24px] border border-blue-100 bg-blue-50/40 p-5 text-sm font-semibold text-[#05336b]">
                Memuat notifikasi...
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-500">
                Gagal memuat notifikasi. Silakan coba lagi.
              </div>
            ) : null}

            {!isLoading && !isError && notifications.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                Belum ada notifikasi untuk akun ini.
              </div>
            ) : null}

            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="relative w-full rounded-[24px] border border-blue-900 bg-white p-5 shadow-[0_8px_16px_rgba(5,51,107,0.15)] transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="mb-1 text-[11px] font-bold text-slate-400">{notif.time}</div>
                <h3
                  className={`mb-1.5 text-[15px] font-bold leading-snug ${
                    notif.status === "picked_up" ? "text-[#f09200]" : "text-green-600"
                  }`}
                >
                  {notif.title}
                </h3>
                <div className="space-y-0.5 text-xs font-semibold text-slate-600">
                  <p className="font-bold text-slate-900">No.Resi : {notif.receiptNumber}</p>
                  <p className="font-medium text-slate-500">Penerima : {notif.recipient}</p>
                </div>

                <div className="absolute bottom-5 right-5 text-right">
                  <Link
                    href={`${CUSTOMER_ROUTES.shippingDetails}?resi=${encodeURIComponent(notif.receiptNumber)}`}
                    className="text-xs font-bold text-[#05336b] transition-all hover:underline"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full shrink-0 justify-center bg-white py-2">
          <div className="h-1 w-32 rounded-full bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

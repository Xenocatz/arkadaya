"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Bell, Calendar, CheckCircle2, MapPin, User } from "lucide-react";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { useCustomerDashboard } from "@/hook/useCustomerDashboard";

export default function ShippingDetailsPage() {
  const searchParams = useSearchParams();
  const receiptNumber = searchParams.get("resi");
  const { data, isLoading, isError } = useCustomerDashboard();
  const order =
    data?.orders.find((item) => item.receiptNumber === receiptNumber) ?? null;
  const unreadNotificationCount =
    data?.notifications.filter((item) => item.status === "picked_up").length ??
    0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-0 sm:p-4 md:p-8">
      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col justify-between overflow-hidden border border-slate-100 bg-white p-6 transition-all duration-500 sm:my-4 sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] sm:shadow-2xl">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-8 w-8 text-[#05336b]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
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

          <div className="flex items-center gap-4 text-[#05336b]">
            <Link
              href={CUSTOMER_ROUTES.notification}
              className="relative block rounded-full p-1 transition-colors hover:bg-slate-50">
              <Bell size={24} className="fill-[#05336b]/10" />
              {unreadNotificationCount > 0 ? (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
              ) : null}
            </Link>
            <Link
              href={CUSTOMER_ROUTES.profile}
              className="block rounded-full p-1 transition-colors hover:bg-slate-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#05336b]/10 text-[#05336b]">
                <User size={20} className="fill-[#05336b]" />
              </div>
            </Link>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto py-2">
          <h1 className="mb-6 mt-2 text-[32px] font-extrabold leading-tight text-[#05336b]">
            Shipping Details
          </h1>

          {isLoading ? (
            <div className="rounded-[24px] border border-blue-100 bg-blue-50/40 p-5 text-sm font-semibold text-[#05336b]">
              Memuat detail pengiriman...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-500">
              Gagal memuat detail pengiriman. Silakan coba lagi.
            </div>
          ) : null}

          {!isLoading && !isError && !order ? (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
              Data pengiriman tidak ditemukan.
            </div>
          ) : null}

          {order ? (
            <>
              <div className="mb-8 grid grid-cols-[24px_130px_8px_1fr] items-start gap-x-2 gap-y-5 text-[15px]">
                <div className="mt-0.5 text-green-600">
                  <CheckCircle2
                    size={20}
                    className="fill-green-600 text-white"
                  />
                </div>
                <div className="font-bold text-slate-800">Status</div>
                <div className="font-bold text-slate-800">:</div>
                <div className="font-semibold text-green-600">
                  {order.statusLabel}
                </div>

                <div className="mt-0.5 text-slate-800">
                  <User size={20} className="text-slate-700" />
                </div>
                <div className="font-bold text-slate-800">Penerima</div>
                <div className="font-bold text-slate-800">:</div>
                <div className="font-semibold text-slate-800">
                  {order.recipient}
                </div>

                <div className="mt-0.5 text-slate-800">
                  <MapPin size={20} className="text-slate-700" />
                </div>
                <div className="font-bold text-slate-800">Alamat</div>
                <div className="font-bold text-slate-800">:</div>
                <div className="text-wrap font-semibold leading-relaxed text-slate-800">
                  {order.address}
                </div>

                <div className="mt-0.5 text-slate-800">
                  <Calendar size={20} className="text-slate-700" />
                </div>
                <div className="font-bold text-slate-800">
                  Tanggal Pengiriman
                </div>
                <div className="font-bold text-slate-800">:</div>
                <div className="font-semibold text-slate-800">{order.date}</div>
              </div>

              <div className="rounded-[24px] bg-[#d6e4f3]/70 p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-[#05336b]">
                  Bukti Pengiriman
                </h3>

                {order.proofPhotoUrls.length === 0 ? (
                  <div className="rounded-[18px] border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm font-medium text-slate-500">
                    Foto bukti pengiriman belum tersedia.
                  </div>
                ) : (
                  <div
                    className={`grid gap-4 ${
                      order.proofPhotoUrls.length === 1
                        ? "grid-cols-1"
                        : order.proofPhotoUrls.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-2"
                    }`}
                  >
                    {order.proofPhotoUrls.map((photoUrl, index) => (
                      <div
                        key={`${photoUrl}-${index}`}
                        className={`flex flex-col items-center ${
                          order.proofPhotoUrls.length === 3 && index === 2
                            ? "col-span-2"
                            : ""
                        }`}
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-[18px] border border-slate-300 bg-white">
                          <Image
                            src={photoUrl}
                            alt={`Foto bukti pengiriman ${index + 1}`}
                            fill
                            sizes="240px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="mt-2 text-center text-[10px] font-bold leading-tight text-slate-800">
                          Foto Bukti Pengiriman {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="shrink-0 pb-2 pt-6">
          <Link href={CUSTOMER_ROUTES.order}>
            <button className="flex h-14 w-full items-center justify-center rounded-full border border-[#05336b] bg-[#5491cd] text-xl font-bold text-white shadow-md shadow-blue-100 transition-all duration-300 hover:bg-[#4380bd] active:scale-[0.98]">
              Close
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

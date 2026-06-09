"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Box,
  Calendar,
  CheckCircle2,
  Locate,
  MapPin,
  Truck,
  User,
  X,
} from "lucide-react";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { useCustomerDashboard } from "@/hook/useCustomerDashboard";
import type { CustomerOrder } from "@/service/customer-dashboard.service";

const renderTimelineIcon = (iconName: string) => {
  switch (iconName) {
    case "box":
      return <Box className="h-5 w-5 text-slate-700" />;
    case "truck":
      return <Truck className="h-5 w-5 text-slate-700" />;
    case "check":
      return <CheckCircle2 className="h-5 w-5 text-slate-700" />;
    default:
      return <Box className="h-5 w-5 text-slate-400" />;
  }
};

export default function OrderPage() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useCustomerDashboard();
  const orders = data?.orders ?? [];
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [searchReceipt, setSearchReceipt] = useState("");
  const [searchError, setSearchError] = useState("");
  const [showEstimateCard, setShowEstimateCard] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<CustomerOrder | null>(null);

  const unreadNotificationCount =
    data?.notifications.filter((item) => item.status === "picked_up").length ?? 0;

  const handleTrackSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchReceipt.trim()) return;

    const foundOrder = orders.find(
      (order) => order.receiptNumber.toLowerCase() === searchReceipt.trim().toLowerCase(),
    );

    if (!foundOrder) {
      setSearchError("Nomor resi tidak ditemukan di akun Anda.");
      return;
    }

    setSearchError("");
    setIsTrackModalOpen(false);
    setSearchedOrder(foundOrder);
    setShowEstimateCard(true);
  };

  if (showLiveMap) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-0 sm:p-4 md:p-8">
        <div className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-slate-100 bg-white transition-all duration-500 sm:my-4 sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] sm:shadow-2xl">
          <div className="absolute inset-0 h-full w-full select-none">
            <Image
              src="/covent_garden_map.png"
              alt="Live Map"
              fill
              sizes="390px"
              className="object-cover opacity-90"
            />

            <div className="absolute left-[48%] top-[42%] z-20 flex translate-x-[-50%] translate-y-[-50%] flex-col items-center animate-bounce">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#05336b] text-white shadow-lg">
                <Truck size={16} />
              </div>
              <div className="mt-0.5 h-1.5 w-3.5 rounded-full bg-black/40 blur-[1px]" />
            </div>

            <div className="absolute bottom-[35%] left-[44%] z-20 flex translate-x-[-50%] translate-y-[-50%] flex-col items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-lg">
                <MapPin size={18} className="fill-white" />
              </div>
              <div className="mt-0.5 h-1.5 w-3 rounded-full bg-black/40 blur-[1px]" />
            </div>

            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              viewBox="0 0 390 844"
              fill="none"
            >
              <path
                d="M 187 355 C 187 450, 172 500, 172 548"
                stroke="#05336b"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="9 7"
                className="opacity-80"
              />
            </svg>
          </div>

          <div className="absolute left-6 right-6 top-6 z-30 flex items-center justify-between">
            <button
              onClick={() => setShowLiveMap(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition-all hover:text-black active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="absolute left-1/2 flex translate-x-[-50%] items-center rounded-full border border-slate-100 bg-white/95 px-5 py-2.5 shadow-md">
              <span className="text-[12px] font-bold tracking-wide text-slate-800">
                Track live Location
              </span>
            </div>
            <div className="w-11" />
          </div>

          <div className="absolute right-6 top-1/2 z-30 flex translate-y-[-50%] flex-col gap-3">
            <button
              onClick={() => window.alert("Menyelaraskan lokasi kurir...")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-all hover:text-black active:scale-95"
            >
              <Locate size={18} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col rounded-t-[32px] border-t border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-300" />
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#05336b]/10 text-[#05336b]">
                <Truck size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black leading-tight text-slate-800">
                  Kurir sedang dalam perjalanan
                </h4>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">
                  {searchedOrder?.receiptNumber} • {searchedOrder?.recipient}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#f07f1b]/10 px-3 py-1.5 text-[12px] font-extrabold uppercase text-[#f07f1b]">
                {searchedOrder?.statusLabel ?? "On Progress"}
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
              strokeLinejoin="round"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight text-[#05336b]">ARKADAYA</span>
              <span className="mt-[-2px] text-[7.5px] font-bold tracking-wider text-[#f07f1b]">
                EXPRESS LOGISTICS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#05336b]">
            <Link
              href={CUSTOMER_ROUTES.notification}
              className="relative block rounded-full p-1 transition-colors hover:bg-slate-50"
            >
              <Bell size={24} className="fill-[#05336b]/10" />
              {unreadNotificationCount > 0 ? (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
              ) : null}
            </Link>
            <Link
              href={CUSTOMER_ROUTES.profile}
              className="block rounded-full p-1 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#05336b]/10 text-[#05336b]">
                <User size={20} className="fill-[#05336b]" />
              </div>
            </Link>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto py-2">
          <h1 className="mb-6 mt-2 text-[32px] font-extrabold leading-none text-[#05336b]">
            Your Order
          </h1>

          {isLoading ? (
            <div className="rounded-[24px] border border-blue-100 bg-blue-50/40 p-5 text-sm font-semibold text-[#05336b]">
              Memuat data pesanan dari Supabase...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-500">
              {error instanceof Error
                ? `Gagal memuat dashboard customer: ${error.message}`
                : "Gagal memuat dashboard customer."}
            </div>
          ) : null}

          {!isLoading && !isError ? (
            <div className="space-y-5">
              {orders.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                  Belum ada data pengiriman untuk akun ini.
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="group relative w-full cursor-pointer overflow-hidden rounded-[24px] border border-blue-100 bg-white p-5 shadow-md shadow-blue-50/50 transition-all duration-300 hover:border-blue-300 hover:shadow-lg active:scale-[0.99]"
                  >
                    <div className="absolute right-5 top-5">
                      <span
                        className={`text-xs font-bold ${
                          order.status === "On Progress"
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {order.statusLabel}
                      </span>
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <Calendar size={16} />
                      <span className="text-[11px] font-semibold tracking-wider">
                        {order.date}
                      </span>
                    </div>

                    <h3 className="mb-1 text-xl font-extrabold text-slate-900 transition-colors group-hover:text-blue-600">
                      No. Resi : {order.receiptNumber}
                    </h3>

                    <div className="mb-1.5 text-[14px] font-bold text-slate-800">
                      Penerima : {order.recipient}
                    </div>

                    <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                      Alamat : {order.address}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>

        <div className="shrink-0 pb-2 pt-6">
          <button
            onClick={() => setIsTrackModalOpen(true)}
            disabled={orders.length === 0}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-[#05336b] bg-[#5491cd] text-xl font-bold text-white shadow-md shadow-blue-100 transition-all duration-300 hover:bg-[#4380bd] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Track Your Order
            <ArrowRight size={20} />
          </button>
        </div>

        {selectedOrder && (
          <div className="animate-fade-in absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs sm:items-center">
            <div className="animate-slide-up no-scrollbar relative flex max-h-[90%] w-full flex-col justify-between overflow-y-auto rounded-t-[36px] border-t-2 border-[#05336b] bg-white p-6 shadow-2xl sm:rounded-[36px] sm:border">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute right-6 top-6 rounded-full p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="pr-8 text-right">
                <span
                  className={`text-xs font-bold ${
                    selectedOrder.status === "On Progress"
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {selectedOrder.statusLabel}
                </span>
              </div>

              <div className="mb-6 mt-4">
                <h2 className="mb-1 text-[22px] font-black leading-tight text-[#05336b]">
                  No. Resi : {selectedOrder.receiptNumber}
                </h2>
                <div className="mb-2 text-base font-extrabold text-[#05336b]">
                  Penerima : {selectedOrder.recipient}
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-slate-500">
                  Alamat : {selectedOrder.address}
                </p>
              </div>

              <div className="relative mb-6 pl-4">
                <div className="absolute bottom-4 left-[25px] top-4 w-[2px] bg-[#05336b]" />
                <div className="space-y-6">
                  {selectedOrder.timeline.map((step, index) => (
                    <div
                      key={`${step.title}-${index}`}
                      className="relative z-10 flex items-center gap-5"
                    >
                      <div className="h-6 w-6 shrink-0 rounded-full border-[3px] border-amber-500 bg-white shadow-sm" />
                      <div className="shrink-0 rounded-lg border border-slate-100 bg-slate-50 p-1.5">
                        {renderTimelineIcon(step.icon)}
                      </div>
                      <div className="flex flex-col">
                        <span className="mb-1 text-[11px] font-bold leading-none text-slate-400">
                          {step.time}
                        </span>
                        <span className="text-[13px] font-extrabold text-slate-800">
                          {step.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between border-y border-slate-100 py-4">
                <span className="text-base font-black text-[#05336b]">Estimasi Sampai</span>
                <span className="text-right text-sm font-bold text-[#05336b]">
                  {selectedOrder.estimatedArrival ?? "Belum tersedia"}
                </span>
              </div>

              <div className="space-y-3.5">
                <button
                  onClick={() =>
                    router.push(
                      `${CUSTOMER_ROUTES.shippingDetails}?resi=${encodeURIComponent(
                        selectedOrder.receiptNumber,
                      )}`,
                    )
                  }
                  className="flex h-13 w-full items-center justify-center rounded-full border border-amber-500 bg-white text-base font-bold text-[#05336b] shadow-sm transition-all duration-300 hover:bg-amber-50/30 active:scale-[0.98]"
                >
                  See Proof of Delivery
                </button>
              </div>
            </div>
          </div>
        )}

        {isTrackModalOpen && (
          <div className="animate-fade-in absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-xs">
            <div className="animate-slide-up relative w-full rounded-[28px] border-2 border-[#05336b] bg-white p-6 shadow-2xl">
              <button
                onClick={() => {
                  setIsTrackModalOpen(false);
                  setSearchError("");
                  setSearchReceipt("");
                }}
                className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>

              <h2 className="mb-4 text-xl font-black text-[#05336b]">Lacak Pesanan</h2>

              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    value={searchReceipt}
                    onChange={(event) => setSearchReceipt(event.target.value)}
                    placeholder="Masukkan Nomor Resi"
                    className="h-12 w-full rounded-full border-2 border-[#05336b] px-4 text-sm font-semibold text-[#05336b] outline-none transition-all duration-300 placeholder:text-[#05336b]/40 focus:ring-4 focus:ring-blue-100"
                  />
                  {searchError ? (
                    <p className="mt-1.5 pl-2 text-[11px] font-bold text-red-500">
                      {searchError}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-full border border-[#05336b] bg-[#5491cd] text-base font-bold text-white transition-all duration-300 hover:bg-[#4380bd] active:scale-[0.98]"
                >
                  Track
                </button>
              </form>
            </div>
          </div>
        )}

        {showEstimateCard && (
          <div
            className="animate-fade-in absolute inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-xs"
            onClick={() => setShowEstimateCard(false)}
          >
            <div
              className="animate-slide-up flex w-full flex-col rounded-t-[32px] bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-300" />
              <div className="text-center">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Estimasi Sampai
                </span>
                <h3 className="mt-1 select-none text-xl font-extrabold text-slate-900">
                  {searchedOrder?.status === "Delivered" ? "Pesanan sudah diterima" : "08:30 PM - 09:00 PM"}
                </h3>
              </div>

              <div className="my-4 h-[1px] w-full bg-slate-200/80" />

              <div
                onClick={() => {
                  setShowEstimateCard(false);
                  setShowLiveMap(true);
                }}
                className="flex cursor-pointer items-stretch gap-4 rounded-2xl border border-slate-200/60 p-4 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99]"
              >
                <div className="flex shrink-0 flex-col items-center justify-between py-1.5">
                  <div className="h-3.5 w-3.5 rounded-full bg-slate-900 shadow-sm" />
                  <div className="my-1.5 flex-1 border-l-2 border-dashed border-slate-400" />
                  <MapPin size={18} className="fill-[#05336b] text-[#05336b]" />
                </div>

                <div className="flex flex-1 flex-col justify-between space-y-4 py-0.5">
                  <div className="text-left">
                    <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Asal
                    </span>
                    <p className="truncate text-xs font-semibold leading-normal text-slate-700">
                      {searchedOrder?.originAddress || "Alamat asal belum tersedia"}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 pt-2 text-left">
                    <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-[#05336b]">
                      Tujuan
                    </span>
                    <p className="truncate text-xs font-bold leading-normal text-slate-800">
                      {searchedOrder?.address || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

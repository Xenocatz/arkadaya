"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bell, PlusCircle, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { useCustomerDashboard } from "@/hook/useCustomerDashboard";
import { updateCustomerOrderPaymentStatus } from "@/service/customer-dashboard.service";

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiptNumber = searchParams.get("resi");
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useCustomerDashboard();
  const order = data?.orders.find((item) => item.receiptNumber === receiptNumber) ?? null;
  const unreadNotificationCount =
    data?.notifications.filter((item) => item.status === "picked_up" && !item.isPaid).length ?? 0;
  const [selectedMethod, setSelectedMethod] = useState<"kredit" | "debit">("kredit");
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardNumber, setCardNumber] = useState("3632824682646492");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayNow = async () => {
    if (!order) return;

    setIsSubmitting(true);

    try {
      const result = await updateCustomerOrderPaymentStatus(order.receiptNumber);

      if (!result.success) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
      window.alert("Pembayaran berhasil diperbarui!");
      router.push(CUSTOMER_ROUTES.order);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Pembayaran gagal diperbarui. Periksa struktur tabel pengiriman.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewCard = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCardNumber.trim()) return;

    setCardNumber(newCardNumber);
    setIsAddCardOpen(false);
    setNewCardNumber("");
    setNewCardHolder("");
    setExpiryDate("");
    setCvv("");
    window.alert("Kartu baru berhasil ditambahkan!");
  };

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
          <div className="mb-6 flex flex-col items-center">
            <h2 className="text-xl font-bold tracking-tight text-black">Pembayaran</h2>
            <div className="mt-1 h-[1.5px] w-40 bg-[#05336b]/30" />
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 text-sm font-semibold text-[#05336b]">
              Memuat data pembayaran...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-500">
              Gagal memuat data pembayaran dari Supabase.
            </div>
          ) : null}

          {!isLoading && !isError && !order ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
              Pesanan untuk pembayaran tidak ditemukan.
            </div>
          ) : null}

          {order ? (
            <>
              <div className="mb-5 rounded-2xl border border-blue-50/50 bg-[#e8f1fa] p-4 shadow-sm">
                <h3 className="mb-1.5 text-base font-bold text-[#05336b]">Ringkasan Pemesanan</h3>
                <div className="mb-2.5 h-[1px] w-full bg-[#05336b]/15" />
                <div className="space-y-2">
                  <div className="text-[14px] font-semibold text-[#05336b]">
                    Order : {order.receiptNumber}
                  </div>
                  <p className="pl-1 text-xs font-medium leading-relaxed text-slate-600">
                    Alamat : {order.address}
                  </p>
                  <p className="pl-1 text-xs font-bold text-[#05336b]">
                    Total : {order.amount}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-3 mt-2 text-[15px] font-bold text-[#05336b]">
                  Pilih Metode Pembayaran
                </h3>

                <div className="space-y-3">
                  {[
                    { key: "kredit", label: "Kartu Kredit", color: "bg-[#0074e4]" },
                    { key: "debit", label: "Kartu Debit", color: "bg-[#fca229]" },
                  ].map((method) => (
                    <div
                      key={method.key}
                      onClick={() => setSelectedMethod(method.key as "kredit" | "debit")}
                      className={`flex cursor-pointer items-center justify-between rounded-full border bg-[#e8f1fa] px-5 py-2.5 transition-all duration-200 ${
                        selectedMethod === method.key
                          ? "border-blue-500 shadow-sm"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative flex h-7 w-10 shrink-0 flex-col justify-between overflow-hidden rounded px-1.5 py-1 shadow-sm ${method.color}`}
                        >
                          <div className="mt-1 h-1 w-full bg-black/80" />
                          <div className="mt-1 flex items-center justify-between">
                            <div className="h-2 w-3.5 rounded-[1px] bg-white/80" />
                            <div className="flex gap-[1px]">
                              <div className="h-2 w-2 rounded-full bg-red-500" />
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  method.key === "kredit" ? "bg-amber-400 -ml-1" : "bg-white/50"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#05336b]">{method.label}</span>
                      </div>

                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#05336b] bg-white">
                        {selectedMethod === method.key ? (
                          <div className="h-3 w-3 rounded-full bg-[#05336b]" />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[28px] border border-slate-200/50 bg-[#e8f1fa] p-[18px] shadow-sm">
                <span className="mb-3 block pl-1 text-xs font-bold tracking-wide text-[#05336b]">
                  Pilih Kartu
                </span>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4">
                  <div className="relative flex h-[72px] w-28 shrink-0 flex-col justify-between overflow-hidden rounded-lg border border-orange-300 bg-[#fca229] py-1.5 shadow-sm">
                    <div className="mt-1 h-3.5 w-full bg-[#2c3e50]" />
                    <div className="mx-2 my-1.5 flex h-5 items-center overflow-hidden rounded border border-slate-200 bg-white px-1">
                      <svg
                        className="h-3 w-full text-slate-400"
                        viewBox="0 0 100 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M 5,10 C 15,3 25,17 35,10 C 45,3 55,17 65,10 C 75,3 85,17 95,10"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 select-none pl-1">
                    <span className="text-[10px] font-bold uppercase leading-none text-slate-500">
                      No. Kartu
                    </span>
                    <span className="mt-1 block break-all text-sm font-black tracking-tight text-slate-900">
                      {cardNumber.match(/.{1,4}/g)?.join(" ") || cardNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setIsAddCardOpen((prev) => !prev)}
                className="mt-4 flex cursor-pointer items-center justify-between rounded-full border border-transparent bg-[#e8f1fa] px-5 py-3 transition-all duration-200 hover:bg-[#d6e4f3] active:scale-[0.99]"
              >
                <span className="text-sm font-bold text-[#05336b]">Tambah Kartu</span>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#05336b] bg-white">
                  {isAddCardOpen ? <div className="h-3 w-3 rounded-full bg-[#05336b]" /> : null}
                </div>
              </div>

              {isAddCardOpen ? (
                <form
                  onSubmit={handleAddNewCard}
                  className="animate-slide-up mt-4 space-y-3 rounded-2xl border-2 border-[#05336b]/40 bg-white p-4 shadow-md"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#05336b]">
                    Detail Kartu Baru
                  </h4>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Nomor Kartu
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="3632 8246 8264 6492"
                      value={newCardNumber}
                      onChange={(event) =>
                        setNewCardNumber(event.target.value.replace(/\D/g, "").slice(0, 16))
                      }
                      className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold outline-none focus:border-[#05336b]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-slate-500">
                      Nama Pemilik Kartu
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={newCardHolder}
                      onChange={(event) => setNewCardHolder(event.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold outline-none focus:border-[#05336b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-500">
                        Valid Thru (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/29"
                        value={expiryDate}
                        onChange={(event) => setExpiryDate(event.target.value.slice(0, 5))}
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold outline-none focus:border-[#05336b]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-500">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        value={cvv}
                        onChange={(event) =>
                          setCvv(event.target.value.replace(/\D/g, "").slice(0, 3))
                        }
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold outline-none focus:border-[#05336b]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-1 flex h-10 w-full items-center justify-center gap-1 rounded-full bg-[#f07f1b] text-xs font-bold text-white shadow-sm transition-all hover:bg-[#d66f15] active:scale-[0.98]"
                  >
                    <PlusCircle size={14} />
                    Simpan Kartu
                  </button>
                </form>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="shrink-0 pb-2 pt-6">
          <button
            onClick={handlePayNow}
            disabled={!order || order.isPaid || isSubmitting}
            className="flex h-14 w-full items-center justify-center rounded-full border border-[#05336b] bg-[#5491cd] text-2xl font-bold text-white shadow-md shadow-blue-100 transition-all duration-300 hover:bg-[#4380bd] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {order?.isPaid ? "Sudah Dibayar" : isSubmitting ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </main>
  );
}

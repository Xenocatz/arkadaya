"use client";

import { useEffect } from "react";
import { X, Truck } from "lucide-react";
import { useAdminNotifications } from "@/hook/useAdminNotifications";

interface NotificationPanelProps {
  /** Callback untuk menutup panel */
  onClose: () => void;
}

/**
 * Panel Notifikasi — muncul sebagai drawer dari kanan layar.
 * Menutup diri saat klik overlay atau tekan Escape.
 */
export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useAdminNotifications();

  // Tutup panel dengan tombol Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Kunci scroll halaman di belakang panel
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      {/* Overlay gelap — klik untuk menutup */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel dari kanan */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header Panel — Logo Arkadaya */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          {/* Logo mirip dengan desain gambar */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-blue-700 font-bold text-sm tracking-widest uppercase">
                Arkadaya
              </span>
              <span className="block text-[10px] text-gray-400 font-normal uppercase tracking-[0.2em]">
                Express Logistics
              </span>
            </div>
          </div>

          {/* Tombol tutup */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            title="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Panel — scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          {/* Judul */}
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6">
            Notification
          </h2>

          {isLoading ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-4 text-sm text-slate-500">
              Memuat notifikasi...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-500">
              Gagal memuat notifikasi dari Supabase.
            </div>
          ) : null}

          {!isLoading && !isError && notifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
              Belum ada notifikasi pengiriman.
            </div>
          ) : null}

          {/* Daftar Kartu Notifikasi */}
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="border border-blue-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow relative">
              {/* Garis aksen biru di sisi kiri */}
              <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-500 rounded-full" />

              <div className="pl-3">
                {/* Waktu notifikasi */}
                <p className="text-xs text-gray-400 mb-1">{notif.waktu}</p>

                {/* Judul notifikasi — orange atau green sesuai tipe */}
                <h3
                  className={`text-base font-bold mb-2 ${
                    notif.warnajudul === "orange"
                      ? "text-orange-400"
                      : "text-green-500"
                  }`}>
                  {notif.judul}
                </h3>

                {/* No. Resi */}
                <p className="text-sm font-bold text-gray-800">
                  No. Resi : <span className="font-bold">{notif.noResi}</span>
                </p>

                {/* Penerima */}
                <p className="text-sm text-gray-500 mt-0.5">
                  Penerima : {notif.penerima}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

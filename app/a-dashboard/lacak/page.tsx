"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Search,
  Truck,
} from "lucide-react";
import {
  getPengirimanList,
  type PengirimanItem,
} from "@/service/pengiriman.service";
import { getUserFriendlyErrorMessage } from "@/utils/error-message";
import { createClient } from "@/lib/supabase/client";

const TrackingMap = dynamic(
  () => import("@/components/tracking/TrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-100/90 px-6 text-center">
        <div className="space-y-3">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#0a4a8a]" />
          <p className="text-sm font-semibold text-slate-600">
            Memuat peta...
          </p>
        </div>
      </div>
    ),
  },
);

/**
 * Mengembalikan class warna teks berdasarkan status paket.
 */
function getStatusColor(status: string): string {
  const normalizedStatus = status.trim().toLowerCase();

  if (
    normalizedStatus === "in transit" ||
    normalizedStatus === "in_transit" ||
    normalizedStatus === "dalam pengiriman" ||
    normalizedStatus === "dalam perjalanan"
  ) {
    return "text-orange-400";
  }

  if (
    normalizedStatus === "canceled" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "dibatalkan"
  ) {
    return "text-red-500";
  }

  if (
    normalizedStatus === "delivered" ||
    normalizedStatus === "terkirim" ||
    normalizedStatus === "selesai"
  ) {
    return "text-green-500";
  }

  return "text-gray-500";
}

/**
 * Halaman Lacak Paket.
 * Menampilkan daftar paket "On Progress" dengan status pengiriman real-time.
 */
function LacakPaketContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = searchParams.get("search") || "";

  const setQuery = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  const [dataLacak, setDataLacak] = useState<PengirimanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPengiriman, setSelectedPengiriman] =
    useState<PengirimanItem | null>(null);

  // State untuk menyimpan lokasi koordinat terkini driver
  const [driverLocation, setDriverLocation] = useState<{
    latitude: number;
    longitude: number;
    label?: string;
  } | null>(null);

  // Efek untuk memantau perubahan GPS driver secara real-time dari Supabase
  useEffect(() => {
    if (!selectedPengiriman || !selectedPengiriman.driver || selectedPengiriman.driver === "-") {
      setDriverLocation(null);
      return;
    }

    let isMounted = true;
    const supabase = createClient();
    let channel: any = null;

    const setupDriverTracking = async () => {
      // 1. Cari ID driver dari tabel profiles berdasarkan nama
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "driver")
        .eq("nama", selectedPengiriman.driver)
        .maybeSingle();

      if (profileError || !profileData || !isMounted) {
        return;
      }

      const driverId = profileData.id;

      // 2. Ambil lokasi awal dari tabel driver_locations
      const { data: locationData } = await supabase
        .from("driver_locations")
        .select("latitude, longitude")
        .eq("driver_id", driverId)
        .maybeSingle();

      if (locationData && isMounted) {
        setDriverLocation({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          label: `Lokasi Terkini: ${selectedPengiriman.driver}`,
        });
      }

      // 3. Berlangganan perubahan baris data secara realtime
      channel = supabase
        .channel(`driver-tracking-${driverId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "driver_locations",
            filter: `driver_id=eq.${driverId}`,
          },
          (payload: any) => {
            if (!isMounted) return;
            const newRecord = payload.new;
            if (newRecord && newRecord.latitude && newRecord.longitude) {
              setDriverLocation({
                latitude: newRecord.latitude,
                longitude: newRecord.longitude,
                label: `Lokasi Terkini: ${selectedPengiriman.driver}`,
              });
            }
          }
        )
        .subscribe();
    };

    void setupDriverTracking();

    return () => {
      isMounted = false;
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [selectedPengiriman]);

  useEffect(() => {
    let isMounted = true;

    const fetchDataLacak = async () => {
      const result = await getPengirimanList();

      if (!isMounted) {
        return;
      }

      if (!result.success) {
        setError(
          result.error
            ? getUserFriendlyErrorMessage(result.error)
            : "Gagal memuat informasi pengiriman. Silakan coba lagi.",
        );
        setDataLacak([]);
        setIsLoading(false);
        return;
      }

      setDataLacak(result.data);
      setIsLoading(false);
    };

    void fetchDataLacak();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter data berdasarkan input pencarian
  const filteredData = dataLacak.filter((item) => {
    if (query === "") return true;
    const q = query.toLowerCase();
    return (
      item.noResi.toLowerCase().includes(q) ||
      item.penerima.toLowerCase().includes(q) ||
      item.driver.toLowerCase().includes(q) ||
      item.update.toLowerCase().includes(q)
    );
  });

  if (selectedPengiriman) {
    const estimasiText =
      selectedPengiriman.status.trim().toLowerCase() === "selesai" ||
      selectedPengiriman.status.trim().toLowerCase() === "terkirim" ||
      selectedPengiriman.status.trim().toLowerCase() === "delivered"
        ? "Pesanan sudah diterima"
        : selectedPengiriman.estimatedArrival ?? "Estimasi belum tersedia";

    return (
      <div className="fixed inset-0 z-50 bg-[#f4f7fa]">
        <div className="flex h-dvh w-full flex-col overflow-hidden bg-white">
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="absolute inset-0 select-none">
              <TrackingMap
                origin={{
                  latitude: selectedPengiriman.asalLat ?? Number.NaN,
                  longitude: selectedPengiriman.asalLng ?? Number.NaN,
                  label: selectedPengiriman.alamatAsal,
                }}
                destination={{
                  latitude: selectedPengiriman.tujuanLat ?? Number.NaN,
                  longitude: selectedPengiriman.tujuanLng ?? Number.NaN,
                  label: selectedPengiriman.alamat,
                }}
                driverLocation={driverLocation}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-[900] bg-gradient-to-b from-white/20 via-transparent to-white/75" />

            <div className="absolute left-4 right-4 top-4 z-[1000] flex items-center md:left-6 md:right-6 md:top-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPengiriman(null)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition-all hover:text-black active:scale-95"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm md:px-4">
                  <Truck className="h-6 w-6 text-blue-600 md:h-7 md:w-7" />
                  <div className="leading-tight">
                    <span className="block text-xs font-black tracking-tight text-[#05336b] md:text-sm">
                      ARKADAYA
                    </span>
                    <span className="mt-[-2px] block text-[8px] font-bold tracking-wider text-[#f07f1b] md:text-[9px]">
                      EXPRESS LOGISTICS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[1000] shrink-0 rounded-t-[32px] border-t border-slate-100 bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl md:px-8 md:pb-8">
            <div className="mx-auto mb-3 h-1 w-24 rounded-full bg-slate-300" />
            <div className="text-center">
              <span className="text-[12px] font-bold text-slate-300">
                Estimasi Sampai
              </span>
              <h3 className="mt-2 text-[20px] font-black tracking-tight text-slate-900 md:text-[24px]">
                {estimasiText}
              </h3>
            </div>

            <div className="my-4 h-px w-full bg-slate-200" />

            <div className="mx-auto w-full max-w-[580px] rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6 md:py-5">
              <div className="flex gap-4">
                <div className="flex shrink-0 flex-col items-center self-stretch py-1">
                  <div className="flex min-h-[32px] items-center justify-center md:min-h-[36px]">
                    <div className="h-5 w-5 rounded-full bg-black md:h-6 md:w-6" />
                  </div>
                  <div className="flex flex-1 items-center">
                    <div className="h-full border-l-2 border-dashed border-slate-300" />
                  </div>
                  <div className="flex min-h-[32px] items-center justify-center md:min-h-[36px]">
                    <MapPin className="h-7 w-7 text-[#0a4a8a]" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-h-[32px] items-center md:min-h-[36px]">
                    <p className="truncate text-[15px] font-medium text-slate-800 md:text-[16px]">
                      {selectedPengiriman.alamatAsal}
                    </p>
                  </div>
                  <div className="my-3 h-px w-full bg-slate-200" />
                  <div className="flex min-h-[32px] items-center md:min-h-[36px]">
                    <p className="truncate text-[15px] font-medium text-slate-800 md:text-[16px]">
                      {selectedPengiriman.alamat}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Judul Halaman */}
      <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
        Lacak Paket
      </h1>

      {/* Panel Pencarian — hanya search bar, tanpa dropdown */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
        <div className="relative max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-blue-50 border border-blue-100 rounded-full py-3 pl-5 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
            <Search className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Panel Tabel On Progress */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden pb-6">
        {/* Subjudul tabel */}
        <div className="px-8 py-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Data Pengiriman
          </h2>
        </div>

        {isLoading ? (
          <div className="px-8 pb-6 text-sm text-gray-500">
            Memuat data lacak paket...
          </div>
        ) : error ? (
          <div className="px-8 pb-6 text-sm text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Header Tabel */}
            <thead>
              <tr>
                <th className="px-8 pb-4 text-sm font-semibold text-gray-700 text-left w-[260px]">
                  No. Resi
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-left w-[220px]">
                  Penerima
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-left w-[180px]">
                  Driver
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-right pr-12">
                  Status
                </th>
              </tr>
            </thead>

            {/* Baris Data */}
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.id || `${item.noResi}-${index}`}
                  className="group"
                >
                  <td className="px-6 py-2" colSpan={4}>
                    {/* Setiap baris dikemas dalam pill/card seperti pada gambar */}
                    <button
                      type="button"
                      onClick={() => setSelectedPengiriman(item)}
                      className="flex w-full items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-left transition-all group-hover:border-blue-200"
                    >
                      {/* No. Resi */}
                      <span className="w-[220px] text-sm text-gray-700 font-normal">
                        {item.noResi}
                      </span>

                      {/* Penerima */}
                      <span className="w-[200px] text-sm text-gray-700">
                        {item.penerima}
                      </span>

                      {/* Driver */}
                      <span className="flex-1 text-sm text-gray-700">
                        {item.driver}
                      </span>

                      {/* Status — rata kanan dengan warna sesuai status */}
                      <span
                        className={`text-sm font-medium w-[160px] text-right ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}

              {/* Pesan jika tidak ada hasil */}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Tidak ada paket ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LacakPaketPage() {
  return (
    <Suspense
      fallback={
        <div className="px-8 pb-6 text-sm text-gray-500">
          Memuat data lacak paket...
        </div>
      }
    >
      <LacakPaketContent />
    </Suspense>
  );
}

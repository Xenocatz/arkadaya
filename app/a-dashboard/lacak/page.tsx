"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  getPengirimanList,
  type PengirimanItem,
} from "@/service/pengiriman.service";

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
export default function LacakPaketPage() {
  const [query, setQuery] = useState("");
  const [dataLacak, setDataLacak] = useState<PengirimanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDataLacak = async () => {
      const result = await getPengirimanList();

      if (!isMounted) {
        return;
      }

      if (!result.success) {
        setError(result.error ?? "Gagal memuat data lacak paket");
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
      item.driver.toLowerCase().includes(q)
    );
  });

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
                <tr key={item.id || `${item.noResi}-${index}`} className="group">
                  <td className="px-6 py-2" colSpan={4}>
                    {/* Setiap baris dikemas dalam pill/card seperti pada gambar */}
                    <div className="flex items-center border border-gray-200 rounded-full px-6 py-3 group-hover:border-blue-200 transition-all bg-white">
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
                    </div>
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

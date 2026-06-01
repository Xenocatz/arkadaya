"use client";

import { useState } from "react";
import { Search, ChevronDown, Download } from "lucide-react";

// Tipe status laporan
type StatusLaporan = "Selesai" | "Dalam Pengiriman" | "Dibatalkan" | "Pending";

// Interface data laporan pengiriman
interface Laporan {
  id: string;
  noResi: string;
  pengirim: string;
  penerima: string;
  driver: string;
  tanggal: string;
  status: StatusLaporan;
}

// Data mock laporan
const DATA_LAPORAN: Laporan[] = [
  {
    id: "1",
    noResi: "AHP001234567",
    pengirim: "Siti Alyana",
    penerima: "Muhammad Iki",
    driver: "Faiz Wibowo",
    tanggal: "01 Mei 2026",
    status: "Selesai",
  },
  {
    id: "2",
    noResi: "AHP001234568",
    pengirim: "Siti Alyana",
    penerima: "Muhammad Iki",
    driver: "Faiz Wibowo",
    tanggal: "02 Mei 2026",
    status: "Dalam Pengiriman",
  },
  {
    id: "3",
    noResi: "AHP001234569",
    pengirim: "Siti Alyana",
    penerima: "Muhammad Iki",
    driver: "Faiz Wibowo",
    tanggal: "03 Mei 2026",
    status: "Dibatalkan",
  },
  {
    id: "4",
    noResi: "AHP001234570",
    pengirim: "Siti Alyana",
    penerima: "Muhammad Iki",
    driver: "Faiz Wibowo",
    tanggal: "04 Mei 2026",
    status: "Pending",
  },
  {
    id: "5",
    noResi: "AHP001234571",
    pengirim: "Siti Alyana",
    penerima: "Muhammad Iki",
    driver: "Faiz Wibowo",
    tanggal: "05 Mei 2026",
    status: "Selesai",
  },
  {
    id: "6",
    noResi: "AHP001234572",
    pengirim: "Siti Alyana",
    penerima: "Muhammad Iki",
    driver: "Faiz Wibowo",
    tanggal: "06 Mei 2026",
    status: "Selesai",
  },
];

/**
 * Mengembalikan class warna teks berdasarkan status laporan.
 */
function getStatusColor(status: StatusLaporan): string {
  switch (status) {
    case "Selesai":
      return "text-green-500";
    case "Dalam Pengiriman":
      return "text-blue-500";
    case "Dibatalkan":
      return "text-red-500";
    case "Pending":
      return "text-orange-400";
    default:
      return "text-gray-500";
  }
}

/**
 * Halaman Laporan.
 * Menampilkan rekap data pengiriman yang bisa dicari dan difilter berdasarkan status.
 */
export default function LaporanPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Opsi filter status
  const statusOptions: string[] = [
    "Semua",
    "Selesai",
    "Dalam Pengiriman",
    "Dibatalkan",
    "Pending",
  ];

  // Filter data berdasarkan pencarian dan status
  const filteredData = DATA_LAPORAN.filter((item) => {
    const q = query.toLowerCase();
    const cocokQuery =
      query === "" ||
      item.noResi.toLowerCase().includes(q) ||
      item.pengirim.toLowerCase().includes(q) ||
      item.driver.toLowerCase().includes(q);

    const cocokStatus =
      statusFilter === "Semua" || item.status === statusFilter;

    return cocokQuery && cocokStatus;
  });

  return (
    <div className="space-y-6">
      {/* Judul Halaman */}
      <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
        Laporan
      </h1>

      {/* Panel Filter */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Input Pencarian */}
          <div className="relative flex-1 min-w-[200px]">
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

          {/* Dropdown Filter Status */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full py-3 px-6 text-sm font-medium text-gray-700 hover:bg-blue-100 transition-all"
            >
              <span>{statusFilter === "Semua" ? "Status" : statusFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatusFilter(opt);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-5 py-3 text-sm transition-colors ${
                      statusFilter === opt
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tombol Ekspor */}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 px-6 text-sm font-medium transition-all">
            <Download className="w-4 h-4" />
            <span>Ekspor</span>
          </button>
        </div>
      </div>

      {/* Panel Tabel Laporan */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden pb-6">
        {/* Subjudul */}
        <div className="px-8 py-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Rekap Pengiriman
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Header Kolom */}
            <thead>
              <tr>
                <th className="px-8 pb-4 text-sm font-semibold text-gray-700 text-left">
                  No. Resi
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-left">
                  Pengirim
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-left">
                  Penerima
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-left">
                  Driver
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-left">
                  Tanggal
                </th>
                <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-right pr-10">
                  Status
                </th>
              </tr>
            </thead>

            {/* Baris Data */}
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="group">
                  <td className="px-6 py-2" colSpan={6}>
                    <div className="flex items-center border border-gray-200 rounded-full px-6 py-3 group-hover:border-blue-200 transition-all bg-white">
                      {/* No. Resi */}
                      <span className="w-[170px] text-sm text-gray-700 font-normal">
                        {item.noResi}
                      </span>
                      {/* Pengirim */}
                      <span className="w-[140px] text-sm text-gray-700">
                        {item.pengirim}
                      </span>
                      {/* Penerima */}
                      <span className="w-[150px] text-sm text-gray-700">
                        {item.penerima}
                      </span>
                      {/* Driver */}
                      <span className="w-[130px] text-sm text-gray-700">
                        {item.driver}
                      </span>
                      {/* Tanggal */}
                      <span className="flex-1 text-sm text-gray-500">
                        {item.tanggal}
                      </span>
                      {/* Status */}
                      <span
                        className={`w-[150px] text-right text-sm font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Pesan kosong */}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Tidak ada laporan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

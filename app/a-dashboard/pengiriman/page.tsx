"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Package, Plus, RefreshCw, Search } from "lucide-react";
import {
  getPengirimanList,
  type PengirimanItem,
} from "@/service/pengiriman.service";
import TambahPengirimanModal from "./tambah/TambahPengirimanModal";
const statusOptions = ["Semua", "In Transit", "Terkirim", "Pending", "Selesai"];

export default function PengirimanPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pengiriman, setPengiriman] = useState<PengirimanItem[]>([]);

  const fetchPengiriman = async () => {
    setIsLoading(true);
    setError("");

    const result = await getPengirimanList();

    if (!result.success) {
      setError(result.error ?? "Gagal memuat data pengiriman");
      setPengiriman([]);
      setIsLoading(false);
      return;
    }

    setPengiriman(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchPengiriman();
  }, []);

  const filteredData = pengiriman.filter((item) => {
    const keyword = query.toLowerCase();
    const cocokQuery =
      query === "" ||
      item.noResi.toLowerCase().includes(keyword) ||
      item.pengirim.toLowerCase().includes(keyword) ||
      item.noTelpPengirim.toLowerCase().includes(keyword) ||
      item.vendor.toLowerCase().includes(keyword) ||
      item.penerima.toLowerCase().includes(keyword) ||
      item.noTelpPenerima.toLowerCase().includes(keyword) ||
      item.driver.toLowerCase().includes(keyword);
    const cocokStatus =
      statusFilter === "Semua" || item.status === statusFilter;

    return cocokQuery && cocokStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-900">
            Pengiriman
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Data tabel pengiriman ditampilkan langsung dari Supabase.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void fetchPengiriman()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-blue-900 transition-all hover:bg-blue-50">
            <RefreshCw className="h-4 w-4" />
            Muat Ulang
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-yellow-500"
            title="Tambah Pengiriman">
            <Plus className="h-4 w-4" />
            Tambah Pengiriman
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[200px] flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari no resi, pengirim, nomor telepon, vendor, penerima, atau driver"
              className="w-full rounded-full border border-blue-100 bg-blue-50 py-3 pl-5 pr-12 text-sm text-gray-700 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
              <Search className="h-4 w-4" />
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-blue-100">
              <span>{statusFilter === "Semua" ? "Status" : statusFilter}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {isDropdownOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setStatusFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full px-5 py-3 text-left text-sm transition-colors ${
                      statusFilter === option
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-gray-50 bg-white shadow-sm">
        {isLoading ? (
          <div className="px-6 py-14 text-center text-sm text-gray-500">
            Memuat data pengiriman...
          </div>
        ) : error ? (
          <div className="px-6 py-14 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    "No Resi",
                    "Pengirim",
                    "No. Telp Pengirim",
                    "Vendor",
                    "Penerima",
                    "No. Telp Penerima",
                    "Alamat",
                    "Status",
                    "Driver",
                    "Update",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr
                    key={item.noResi}
                    className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 rounded-lg bg-blue-50 p-2">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {item.noResi}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.pengirim}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.noTelpPengirim}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.vendor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.penerima}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.noTelpPenerima}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "In Transit"
                            ? "bg-blue-50 text-blue-600"
                            : item.status === "Terkirim"
                              ? "bg-yellow-50 text-yellow-600"
                              : item.status === "Selesai"
                                ? "bg-green-50 text-green-600"
                                : "bg-gray-100 text-gray-600"
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.driver}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.update}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-12 text-center text-gray-400">
                      Tidak ada data pengiriman ditemukan.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen ? (
        <TambahPengirimanModal
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchPengiriman}
        />
      ) : null}
    </div>
  );
}

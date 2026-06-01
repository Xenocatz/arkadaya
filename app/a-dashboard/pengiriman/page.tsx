"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus, ArrowLeft, Phone, Package } from "lucide-react";
import Modal from "@/components/ui/Modal";

// Interface data pengiriman
interface Pengiriman {
  id: string;
  noResi: string;
  pengirim: string;
  penerima: string;
  alamat: string;
  status: string;
  driver: string;
  update: string;
}

// State awal form tambah pengiriman
const FORM_KOSONG = {
  noResi: "",
  namaPengirim: "",
  noTelpPengirim: "",
  vendor: "",
  driver: "",
  namaPenerima: "",
  noTelpPenerima: "",
  alamat: "",
};

// Data mock sesuai contoh gambar
const DATA_PENGIRIMAN: Pengiriman[] = [
  { id: "1", noResi: "AHP001234567", pengirim: "Siti Alyana", penerima: "Muhammad Iki", alamat: "Depok Raya", status: "In Transit", driver: "Faiz Wibowo", update: "15:00" },
  { id: "2", noResi: "AHP001234567", pengirim: "Siti Alyana", penerima: "Muhammad Iki", alamat: "Depok Raya", status: "In Transit", driver: "Faiz Wibowo", update: "15:00" },
  { id: "3", noResi: "AHP001234567", pengirim: "Siti Alyana", penerima: "Muhammad Iki", alamat: "Depok Raya", status: "In Transit", driver: "Faiz Wibowo", update: "15:00" },
  { id: "4", noResi: "AHP001234567", pengirim: "Siti Alyana", penerima: "Muhammad Iki", alamat: "Depok Raya", status: "In Transit", driver: "Faiz Wibowo", update: "15:00" },
  { id: "5", noResi: "AHP001234567", pengirim: "Siti Alyana", penerima: "Muhammad Iki", alamat: "Depok Raya", status: "In Transit", driver: "Faiz Wibowo", update: "15:00" },
  { id: "6", noResi: "AHP001234567", pengirim: "Siti Alyana", penerima: "Muhammad Iki", alamat: "Depok Raya", status: "In Transit", driver: "Faiz Wibowo", update: "15:00" },
];

/**
 * Halaman Pengiriman Barang.
 * Tombol FAB (+) membuka modal "Tambah Pengiriman Baru".
 */
export default function PengirimanPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(FORM_KOSONG);

  const statusOptions = ["Semua", "In Transit", "Terkirim", "Pending", "Selesai"];

  const filteredData = DATA_PENGIRIMAN.filter((item) => {
    const cocokQuery =
      query === "" ||
      item.noResi.toLowerCase().includes(query.toLowerCase()) ||
      item.pengirim.toLowerCase().includes(query.toLowerCase()) ||
      item.driver.toLowerCase().includes(query.toLowerCase());
    const cocokStatus = statusFilter === "Semua" || item.status === statusFilter;
    return cocokQuery && cocokStatus;
  });

  // Tangani perubahan input form
  const handleChange = (field: keyof typeof FORM_KOSONG, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Simpan data pengiriman baru (simulasi)
  const handleSave = () => {
    // TODO: integrasikan dengan API/backend
    setIsModalOpen(false);
    setForm(FORM_KOSONG);
  };

  // Tutup modal dan reset form
  const handleClose = () => {
    setIsModalOpen(false);
    setForm(FORM_KOSONG);
  };

  // Style input field yang konsisten
  const inputClass =
    "w-full border border-blue-300 rounded-xl py-3 px-4 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all";

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">Pengiriman</h1>

      {/* Panel Filter */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
        <div className="flex items-center gap-4 flex-wrap">
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
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full py-3 px-6 text-sm font-medium text-gray-700 hover:bg-blue-100 transition-all"
            >
              <span>{statusFilter === "Semua" ? "Status" : statusFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setIsDropdownOpen(false); }}
                    className={`block w-full text-left px-5 py-3 text-sm transition-colors ${statusFilter === opt ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel Tabel */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                {["No Resi", "Pengirim", "Penerima", "Alamat", "Status", "Driver", "Update"].map((col) => (
                  <th key={col} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{item.noResi}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.pengirim}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.penerima}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.alamat}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'In Transit' ? 'text-blue-600 bg-blue-50' :
                      item.status === 'Terkirim'   ? 'text-yellow-600 bg-yellow-50' :
                      item.status === 'Selesai'    ? 'text-green-600 bg-green-50' :
                      item.status === 'Pending'    ? 'text-gray-600 bg-gray-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.driver}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.update}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Tidak ada data pengiriman ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FAB Tambah — membuka modal */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Tambah Pengiriman"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* ===== Modal Tambah Pengiriman Baru ===== */}
      {isModalOpen && (
        <Modal title="Tambah Pengiriman Baru" onClose={handleClose} size="lg">
          {/* Tombol kembali di kiri atas */}
          <button
            onClick={handleClose}
            className="absolute top-5 left-5 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Form 2 kolom sesuai gambar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {/* Kolom Kiri */}
            <div className="space-y-5">
              {/* No. Resi */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">No. Resi</label>
                <input
                  type="text"
                  value={form.noResi}
                  onChange={(e) => handleChange("noResi", e.target.value)}
                  placeholder=""
                  className={inputClass}
                />
              </div>

              {/* Nama Pengirim */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">Nama Pengirim</label>
                <input
                  type="text"
                  value={form.namaPengirim}
                  onChange={(e) => handleChange("namaPengirim", e.target.value)}
                  placeholder=""
                  className={inputClass}
                />
              </div>

              {/* No. Telp Pengirim */}
              <div className="space-y-1.5">
                <div className="flex items-center border border-blue-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <span className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 border-r border-blue-300 whitespace-nowrap">
                    No.Telp
                  </span>
                  <div className="flex items-center flex-1 pl-3">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="tel"
                      value={form.noTelpPengirim}
                      onChange={(e) => handleChange("noTelpPengirim", e.target.value)}
                      placeholder=""
                      className="w-full py-3 pr-4 text-sm text-gray-700 outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Vendor */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">Vendor</label>
                <input
                  type="text"
                  value={form.vendor}
                  onChange={(e) => handleChange("vendor", e.target.value)}
                  placeholder=""
                  className={inputClass}
                />
              </div>

              {/* Driver */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">Driver</label>
                <input
                  type="text"
                  value={form.driver}
                  onChange={(e) => handleChange("driver", e.target.value)}
                  placeholder=""
                  className={inputClass}
                />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-5">
              {/* Nama Penerima */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">Nama Penerima</label>
                <input
                  type="text"
                  value={form.namaPenerima}
                  onChange={(e) => handleChange("namaPenerima", e.target.value)}
                  placeholder=""
                  className={inputClass}
                />
              </div>

              {/* No. Telp Penerima */}
              <div className="space-y-1.5">
                <div className="flex items-center border border-blue-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <span className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 border-r border-blue-300 whitespace-nowrap">
                    No.Telp
                  </span>
                  <div className="flex items-center flex-1 pl-3">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="tel"
                      value={form.noTelpPenerima}
                      onChange={(e) => handleChange("noTelpPenerima", e.target.value)}
                      placeholder=""
                      className="w-full py-3 pr-4 text-sm text-gray-700 outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">Alamat</label>
                <textarea
                  value={form.alamat}
                  onChange={(e) => handleChange("alamat", e.target.value)}
                  rows={5}
                  placeholder=""
                  className="w-full border border-blue-300 rounded-xl py-3 px-4 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Tombol Save */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-10 py-3 text-sm transition-all hover:shadow-md active:scale-95"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

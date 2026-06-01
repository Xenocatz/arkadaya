"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  MapPin,
  FileText,
  PenLine,
  Eye,
  ArrowLeft,
  X,
} from "lucide-react";
import Modal from "@/components/ui/Modal";

// Interface data driver
interface Driver {
  id: string;
  idDriver: string;
  nama: string;
  noTelp: string;
  email: string;
  platNomor: string;
  tipeKendaraan: string;
  statusOperasional: "Active" | "In Active";
  lokasiTerakhir: string;
  lastUpdated: string;
  alasanPerubahan?: string;
}

// State awal form tambah driver baru
const FORM_KOSONG = {
  namaDriver: "",
  noTelp: "",
  email: "",
};

// Data mock driver awal disesuaikan dengan gambar contoh
const DATA_DRIVER_AWAL: Driver[] = [
  {
    id: "1",
    idDriver: "DRV001",
    nama: "Muhammad Faiz",
    noTelp: "+62-6547-83636",
    email: "m.faiz@example.com",
    platNomor: "B 1234 AR",
    tipeKendaraan: "Box Truck",
    statusOperasional: "In Active",
    lokasiTerakhir: "Parung Panjang, Tanggerang",
    lastUpdated: "Mei 2025",
    alasanPerubahan: "",
  },
  {
    id: "2",
    idDriver: "DRV002",
    nama: "Budiman",
    noTelp: "+62-8123-45678",
    email: "budiman@example.com",
    platNomor: "B 5678 CD",
    tipeKendaraan: "Flatbed Truck",
    statusOperasional: "Active",
    lokasiTerakhir: "Bekasi, Jawa Barat",
    lastUpdated: "Mei 2025",
    alasanPerubahan: "",
  },
];

/**
 * Halaman Manajemen Driver.
 * Menampilkan daftar driver, detail driver, dan modal edit driver.
 */
export default function DriverPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State untuk modal tambah driver baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(FORM_KOSONG);

  // State untuk data driver dinamis
  const [drivers, setDrivers] = useState<Driver[]>(DATA_DRIVER_AWAL);

  // State untuk melacak driver yang sedang dilihat detailnya
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null);

  // State untuk melacak driver yang sedang diedit
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editForm, setEditForm] = useState<Driver | null>(null);

  const statusOptions = ["Semua", "Active", "In Active"];

  // Memfilter data driver berdasarkan input pencarian dan status filter
  const filteredData = drivers.filter((driver) => {
    const cocokQuery =
      query === "" ||
      driver.idDriver.toLowerCase().includes(query.toLowerCase()) ||
      driver.nama.toLowerCase().includes(query.toLowerCase());
    const cocokStatus =
      statusFilter === "Semua" || driver.statusOperasional === statusFilter;
    return cocokQuery && cocokStatus;
  });

  // Menangani perubahan input pada form tambah driver baru
  const handleChange = (field: keyof typeof FORM_KOSONG, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Simpan driver baru ke dalam state list driver (simulasi)
  const handleSave = () => {
    const newDriver: Driver = {
      id: String(drivers.length + 1),
      idDriver: `DRV00${drivers.length + 1}`,
      nama: form.namaDriver,
      noTelp: form.noTelp,
      email: form.email,
      platNomor: "B 9999 XX",
      tipeKendaraan: "Box Truck",
      statusOperasional: "Active",
      lokasiTerakhir: "Jakarta Selatan, DKI Jakarta",
      lastUpdated: "Mei 2025",
      alasanPerubahan: "",
    };
    setDrivers((prev) => [...prev, newDriver]);
    setIsModalOpen(false);
    setForm(FORM_KOSONG);
  };

  // Menyimpan perubahan data driver hasil edit
  const handleSaveEdit = () => {
    if (!editForm) return;

    // Update list driver utama
    setDrivers((prev) =>
      prev.map((d) => (d.id === editForm.id ? editForm : d)),
    );

    // Update data driver yang sedang dilihat detailnya agar langsung ter-refresh di layar detail
    if (viewingDriver && viewingDriver.id === editForm.id) {
      setViewingDriver(editForm);
    }

    // Tutup modal edit
    setEditingDriver(null);
    setEditForm(null);
  };

  // Tutup modal tambah dan reset form
  const handleClose = () => {
    setIsModalOpen(false);
    setForm(FORM_KOSONG);
  };

  // Style input field yang konsisten dengan desain
  const inputClass =
    "w-full border border-blue-300 rounded-xl py-3 px-4 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all bg-white";

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
        Detail Driver
      </h1>

      {/* ===== TAMPILAN DETAIL DRIVER ===== */}
      {viewingDriver ? (
        <div className="bg-white rounded-3xl border border-blue-200 shadow-md overflow-hidden">
          {/* Header Card Detail Driver */}
          <div className="bg-blue-50/50 border-b border-blue-100 px-8 py-4">
            <button
              onClick={() => setViewingDriver(null)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Driver List</span>
            </button>
          </div>

          {/* Konten Card Detail Driver */}
          <div className="p-8 space-y-8">
            {/* Header Section dengan Icon Personal Details */}
            <div className="flex items-center gap-3 text-lg font-bold text-blue-950">
              <FileText className="w-6 h-6 text-blue-900" />
              <span>Personal Details</span>
            </div>

            {/* Grid Informasi Driver */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
              {/* Kolom Detail Informasi */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    ID Driver
                  </p>
                  <p className="text-2xl font-extrabold text-blue-950">
                    {viewingDriver.idDriver}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Full Name
                  </p>
                  <p className="text-2xl font-extrabold text-blue-950">
                    {viewingDriver.nama}
                  </p>
                </div>
                {/* Spacer agar posisi pas sesuai grid avatar */}
                <div className="hidden lg:block"></div>

                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Contact Number
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {viewingDriver.noTelp}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Vehicle License Plate
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {viewingDriver.platNomor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Vehicle Type
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {viewingDriver.tipeKendaraan}
                  </p>
                </div>
              </div>

              {/* Avatar Driver */}
              <div className="flex-shrink-0 border border-blue-200 rounded-full p-1 shadow-inner bg-blue-50/50">
                <img
                  src="/driver_avatar.png"
                  alt="Driver Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Informasi Operasional Sekarang */}
            <div className="border border-blue-200 rounded-2xl bg-blue-50/10 p-6 space-y-4">
              <h3 className="text-lg font-bold text-blue-950">
                Current Operations
              </h3>
              <div className="flex flex-col md:flex-row gap-y-4 gap-x-16 text-sm">
                <div>
                  <span className="text-gray-500 font-medium">Status :</span>
                  <span
                    className={`ml-2 font-bold ${
                      viewingDriver.statusOperasional === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                    {viewingDriver.statusOperasional === "Active"
                      ? "Active"
                      : "In Active"}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-500 font-medium">
                    Last Known Location
                  </span>
                  <span className="text-gray-800 font-bold ml-1">
                    {viewingDriver.lokasiTerakhir}
                  </span>
                  <span className="text-xs text-gray-400 font-normal ml-3">
                    Last Updated {viewingDriver.lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Edit */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setEditingDriver(viewingDriver);
                  setEditForm({ ...viewingDriver });
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-8 font-bold shadow-md transition-all hover:scale-105 active:scale-95">
                <PenLine className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ===== TAMPILAN DAFTAR DRIVER (TAMPILAN UTAMA) ===== */
        <>
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
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full py-3 px-6 text-sm font-medium text-gray-700 hover:bg-blue-100 transition-all">
                  <span>
                    {statusFilter === "Semua" ? "Status" : statusFilter}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
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
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel Live Activity Feed (Tabel Driver) */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden relative pb-6">
            <div className="px-8 py-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Live Activity Feed
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-8 pb-4 text-sm font-semibold text-gray-700 text-left w-[220px]">
                      ID Driver
                    </th>
                    <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-left w-[220px]">
                      Nama
                    </th>
                    <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-center">
                      Status Operasional
                    </th>
                    <th className="px-6 pb-4 text-sm font-semibold text-gray-700 text-center w-[160px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="px-4">
                  {filteredData.map((driver) => (
                    <tr key={driver.id} className="group">
                      <td className="px-6 py-2" colSpan={4}>
                        <div className="flex items-center border border-gray-200 rounded-full px-4 py-3 group-hover:border-blue-200 transition-all bg-white">
                          <span className="w-[180px] text-sm text-gray-700 font-normal">
                            {driver.idDriver}
                          </span>
                          <span className="w-[180px] text-sm text-gray-700 font-semibold">
                            {driver.nama}
                          </span>
                          <span className="flex-1 text-center text-sm font-medium">
                            <span
                              className={
                                driver.statusOperasional === "Active"
                                  ? "text-green-500 font-semibold"
                                  : "text-red-500 font-semibold"
                              }>
                              {driver.statusOperasional}
                            </span>
                          </span>
                          <div className="flex items-center gap-3 w-[140px] justify-center">
                            <button
                              title="Lihat Peta"
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
                              <MapPin className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setViewingDriver(driver)}
                              title="Detail Driver"
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-400">
                        Tidak ada driver ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* FAB Tambah Driver Baru */}
            <div className="flex justify-end px-6 pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-12 h-12 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Tambah Driver">
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== MODAL ADD NEW DRIVER (REUSABLE COMPONENT) ===== */}
      {isModalOpen && (
        <Modal title="Add New Driver" onClose={handleClose} size="md">
          <div className="space-y-5">
            {/* Nama Driver */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-800">
                Nama Driver
              </label>
              <input
                type="text"
                value={form.namaDriver}
                onChange={(e) => handleChange("namaDriver", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* No. Telp */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-800">
                No. Telp
              </label>
              <input
                type="tel"
                value={form.noTelp}
                onChange={(e) => handleChange("noTelp", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-800">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Tombol Save */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-10 py-3 text-sm transition-all hover:shadow-md active:scale-95">
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ===== MODAL EDIT DRIVER (CUSTOM UNTUK MENYESUAIKAN DENGAN GAMBAR DESAIN) ===== */}
      {editingDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-3xl border border-blue-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal Edit */}
            <div className="bg-blue-50/25 border-b border-blue-200 px-8 py-4 flex justify-between items-center">
              <span className="text-sm font-extrabold text-blue-900 uppercase tracking-wide">
                {editingDriver.idDriver}
              </span>
              <button
                onClick={() => {
                  setEditingDriver(null);
                  setEditForm(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                title="Tutup">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Utama Form Edit */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bagian Kiri: Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-blue-950">
                    Personal Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm?.nama || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, nama: e.target.value } : null,
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={editForm?.noTelp || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, noTelp: e.target.value } : null,
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1">
                        ID Driver
                      </label>
                      <input
                        type="text"
                        value={editForm?.idDriver || ""}
                        className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian Kanan: Detail Operasional dan Kendaraan */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-blue-950">
                      Operational &amp; Vehicle Details
                    </h3>
                    <div className="border border-blue-200 rounded-full p-0.5 overflow-hidden flex-shrink-0 bg-blue-50/50 shadow-sm">
                      <img
                        src="/driver_avatar.png"
                        alt="Driver Avatar"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 -mt-2">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={editForm?.platNomor || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev
                              ? { ...prev, platNomor: e.target.value }
                              : null,
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        value={editForm?.tipeKendaraan || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev
                              ? { ...prev, tipeKendaraan: e.target.value }
                              : null,
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian Bawah: Driver Status Management */}
              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-blue-950">
                  Driver Status Management
                </h3>
                <div className="border border-blue-200 rounded-2xl bg-blue-50/10 p-5 flex flex-col md:flex-row gap-4 items-end">
                  {/* Status Dropdown */}
                  <div className="w-full md:w-[240px] relative">
                    <label className="text-sm font-bold text-gray-700 block mb-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={editForm?.statusOperasional || "Active"}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  statusOperasional: e.target.value as
                                    | "Active"
                                    | "In Active",
                                }
                              : null,
                          )
                        }
                        className="w-full border border-blue-300 rounded-xl py-3 pl-4 pr-10 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all appearance-none cursor-pointer">
                        <option value="Active">Active</option>
                        <option value="In Active">In Active</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Alasan Perubahan Status */}
                  <div className="flex-1 w-full">
                    <label className="text-sm font-bold text-gray-700 block mb-1">
                      Reason For Status Changed
                    </label>
                    <input
                      type="text"
                      value={editForm?.alasanPerubahan || ""}
                      onChange={(e) =>
                        setEditForm((prev) =>
                          prev
                            ? { ...prev, alasanPerubahan: e.target.value }
                            : null,
                        )
                      }
                      placeholder="Reason For Status Changed"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Modal: Tombol Cancel dan Save */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setEditingDriver(null);
                    setEditForm(null);
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-xl px-8 py-3 text-sm transition-all active:scale-95">
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-10 py-3 text-sm transition-all shadow-md hover:scale-105 active:scale-95">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

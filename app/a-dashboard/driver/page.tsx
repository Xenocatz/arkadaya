"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  X,
  PencilLine,
} from "lucide-react";
import {
  getDriverProfiles,
  updateDriverProfile,
  type DriverProfile,
} from "@/service/driver.service";

export default function DriverPage() {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(
    null,
  );
  const [editingDriver, setEditingDriver] = useState<DriverProfile | null>(
    null,
  );
  const [editForm, setEditForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
  });
  const [editError, setEditError] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchDrivers = async () => {
    setIsLoading(true);
    setError("");

    const result = await getDriverProfiles();

    if (!result.success) {
      setError(result.error ?? "Gagal memuat data driver");
      setDrivers([]);
      setIsLoading(false);
      return;
    }

    setDrivers(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadDrivers = async () => {
      const result = await getDriverProfiles();

      if (!isMounted) {
        return;
      }

      if (!result.success) {
        setError(result.error ?? "Gagal memuat data driver");
        setDrivers([]);
        setIsLoading(false);
        return;
      }

      setError("");
      setDrivers(result.data);
      setIsLoading(false);
    };

    void loadDrivers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDrivers = drivers.filter((driver) => {
    const keyword = query.toLowerCase();
    return (
      driver.nama?.toLowerCase().includes(keyword) ||
      driver.email?.toLowerCase().includes(keyword) ||
      driver.no_hp?.toLowerCase().includes(keyword)
    );
  });

  // Membuka pencarian map berdasarkan nama driver yang dipilih
  const handleOpenMap = (driver: DriverProfile) => {
    const searchQuery = encodeURIComponent(driver.nama ?? "driver");
    window.open(`https://www.google.com/maps/search/${searchQuery}`, "_blank");
  };

  const selectedDriverStatus = "Active";

  // Membuka modal edit dan mengisi form dengan data driver yang dipilih
  const handleOpenEdit = () => {
    if (!selectedDriver) return;

    setEditForm({
      nama: selectedDriver.nama ?? "",
      email: selectedDriver.email ?? "",
      no_hp: selectedDriver.no_hp ?? "",
    });
    setEditError("");
    setEditingDriver(selectedDriver);
  };

  const handleSaveEdit = async () => {
    if (!editingDriver) return;

    setIsSavingEdit(true);
    setEditError("");

    try {
      const result = await updateDriverProfile(editingDriver.id, {
        nama: editForm.nama.trim(),
        email: editForm.email.trim(),
        no_hp: editForm.no_hp.trim(),
      });

      if (!result.success) {
        throw new Error(result.error ?? "Gagal memperbarui driver");
      }

      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === editingDriver.id
            ? {
                ...driver,
                nama: editForm.nama.trim(),
                email: editForm.email.trim(),
                no_hp: editForm.no_hp.trim(),
              }
            : driver,
        ),
      );

      setSelectedDriver((prev) =>
        prev?.id === editingDriver.id
          ? {
              ...prev,
              nama: editForm.nama.trim(),
              email: editForm.email.trim(),
              no_hp: editForm.no_hp.trim(),
            }
          : prev,
      );

      setEditingDriver(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-900">
            Driver
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Daftar driver diambil langsung dari tabel `profiles`.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void fetchDrivers()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-blue-900 transition-all hover:bg-blue-50">
            <RefreshCw className="h-4 w-4" />
            Muat Ulang
          </button>

          <Link
            href="/a-dashboard/driver/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-yellow-500">
            <Plus className="h-4 w-4" />
            Tambah Driver
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, email, atau nomor telepon"
            className="w-full rounded-full border border-blue-100 bg-blue-50 py-3 pl-5 pr-12 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
        <div className="border-b border-blue-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Live Activity Feed
          </h2>
        </div>

        {isLoading ? (
          <div className="px-6 py-14 text-center text-sm text-gray-500">
            Memuat data driver...
          </div>
        ) : error ? (
          <div className="px-6 py-14 text-center text-sm text-red-600">
            {error}
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <UserRound className="mx-auto h-10 w-10 text-blue-300" />
            <p className="mt-4 text-sm font-medium text-gray-700">
              Belum ada driver yang tersimpan.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Tambahkan driver pertama melalui tombol Tambah Driver.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/60 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Driver</th>
                  <th className="px-6 py-4 font-semibold">Nama</th>
                  <th className="px-6 py-4 font-semibold">
                    Status Operasional
                  </th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {driver.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {driver.nama ?? "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenMap(driver)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                          title="Lihat Map">
                          <MapPin className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedDriver(driver)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                          title="Detail Driver">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDriver ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-2xl">
            <div className="bg-blue-50/25 border-b border-blue-200 px-8 py-4 flex justify-between items-center">
              <span className="text-sm font-extrabold text-blue-900 uppercase tracking-wide">
                {selectedDriver.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDriver(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                title="Tutup">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center gap-3 text-lg font-bold text-blue-950">
                <UserRound className="w-6 h-6 text-blue-900" />
                <span>Personal Details</span>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      ID Driver
                    </p>
                    <p className="text-2xl font-extrabold text-blue-950">
                      {selectedDriver.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Full Name
                    </p>
                    <p className="text-2xl font-extrabold text-blue-950">
                      {selectedDriver.nama ?? "-"}
                    </p>
                  </div>
                  <div className="hidden lg:block"></div>

                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Contact Number
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedDriver.no_hp ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Email
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedDriver.email ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Role
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedDriver.role ?? "driver"}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 border border-blue-200 rounded-full p-1 shadow-inner bg-blue-50/50">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <UserRound className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 rounded-2xl bg-blue-50/10 p-6 space-y-4">
                <h3 className="text-lg font-bold text-blue-950">
                  Current Operations
                </h3>
                <div className="flex flex-col md:flex-row gap-y-4 gap-x-16 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium">Status :</span>
                    <span className="ml-2 font-bold text-green-500">
                      {selectedDriverStatus}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-gray-500 font-medium">
                      Last Known Location
                    </span>
                    <span className="text-gray-800 font-bold ml-1">
                      Tidak tersedia
                    </span>
                    <span className="text-xs text-gray-400 font-normal ml-3">
                      Last Updated - 
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleOpenEdit}
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white py-3 px-8 font-bold text-blue-900 transition-all hover:bg-blue-50 active:scale-95">
                    <PencilLine className="w-4 h-4" />
                    <span>Edit Driver</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenMap(selectedDriver)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-8 font-bold shadow-md transition-all hover:scale-105 active:scale-95">
                    <MapPin className="w-4 h-4" />
                    <span>Lihat Map</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editingDriver ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-blue-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-blue-100 px-8 py-4">
              <div>
                <h3 className="text-lg font-bold text-blue-950">Edit Driver</h3>
                <p className="text-sm text-gray-500">
                  Ubah data driver lalu simpan ke tabel `profiles`.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingDriver(null)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                title="Tutup">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-8 py-7">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  Nama Driver
                </label>
                <input
                  type="text"
                  value={editForm.nama}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  No. Telp
                </label>
                <input
                  type="tel"
                  value={editForm.no_hp}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, no_hp: e.target.value }))
                  }
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {editError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {editError}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDriver(null)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50">
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
                  {isSavingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

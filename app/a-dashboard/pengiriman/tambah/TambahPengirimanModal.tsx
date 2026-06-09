"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Phone, Save } from "lucide-react";
import AddressAutocomplete, {
  type AddressValue,
} from "@/components/maps/AddressAutocomplete";
import Modal from "@/components/ui/Modal";
import {
  addPengiriman,
  type PengirimanFormInput,
} from "@/service/pengiriman.service";
import { getDriverProfiles } from "@/service/driver.service";
import { generateNoResi } from "@/utils/format";

const EMPTY_ADDRESS: AddressValue = {
  address: "",
  lat: null,
  lng: null,
};

function createEmptyForm(): PengirimanFormInput {
  return {
    noResi: generateNoResi(),
    namaPengirim: "",
    noTelpPengirim: "",
    vendor: "",
    driver: "",
    namaPenerima: "",
    noTelpPenerima: "",
    alamatAsal: { ...EMPTY_ADDRESS },
    alamatTujuan: { ...EMPTY_ADDRESS },
  };
}

interface TambahPengirimanModalProps {
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

export default function TambahPengirimanModal({
  onClose,
  onSaved,
}: TambahPengirimanModalProps) {
  const [form, setForm] = useState<PengirimanFormInput>(() => createEmptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [driverNames, setDriverNames] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDrivers = async () => {
      setIsLoadingDrivers(true);

      const result = await getDriverProfiles();

      if (!isMounted) {
        return;
      }

      if (!result.success) {
        setError(result.error ?? "Gagal memuat daftar driver");
        setDriverNames([]);
        setIsLoadingDrivers(false);
        return;
      }

      const daftarDriver = result.data
        .map((item) => item.nama?.trim())
        .filter((value): value is string => Boolean(value));

      setDriverNames(daftarDriver);
      setIsLoadingDrivers(false);
    };

    void fetchDrivers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    field: Exclude<keyof PengirimanFormInput, "alamatAsal" | "alamatTujuan">,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (
    field: "alamatAsal" | "alamatTujuan",
    value: AddressValue,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const alamatAsalValid =
    form.alamatAsal.address.trim() !== "" &&
    form.alamatAsal.lat !== null &&
    form.alamatAsal.lng !== null;

  const alamatTujuanValid =
    form.alamatTujuan.address.trim() !== "" &&
    form.alamatTujuan.lat !== null &&
    form.alamatTujuan.lng !== null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const driverInput = form.driver.trim();
    const driverTersedia = driverNames.some(
      (namaDriver) => namaDriver.toLowerCase() === driverInput.toLowerCase(),
    );

    if (isLoadingDrivers) {
      setError("Daftar driver masih dimuat. Silakan coba sesaat lagi.");
      return;
    }

    if (!driverTersedia) {
      setError("Nama driver harus terdaftar pada tabel profiles.");
      return;
    }

    if (!alamatAsalValid) {
      setError("Alamat asal wajib dipilih dari suggestion alamat.");
      return;
    }

    if (!alamatTujuanValid) {
      setError("Alamat tujuan wajib dipilih dari suggestion alamat.");
      return;
    }

    setIsSaving(true);

    try {
      const result = await addPengiriman({
        noResi: form.noResi.trim(),
        namaPengirim: form.namaPengirim.trim(),
        noTelpPengirim: form.noTelpPengirim.trim(),
        vendor: form.vendor.trim(),
        driver: driverInput,
        namaPenerima: form.namaPenerima.trim(),
        noTelpPenerima: form.noTelpPenerima.trim(),
        alamatAsal: form.alamatAsal.address.trim(),
        asalLat: form.alamatAsal.lat!,
        asalLng: form.alamatAsal.lng!,
        alamatTujuan: form.alamatTujuan.address.trim(),
        tujuanLat: form.alamatTujuan.lat!,
        tujuanLng: form.alamatTujuan.lng!,
      });

      if (!result.success) {
        throw new Error(result.error ?? "Gagal menambahkan pengiriman");
      }

      await onSaved();
      setForm(createEmptyForm());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-blue-300 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <Modal title="Tambah Pengiriman Baru" onClose={onClose} size="lg">
      <button
        type="button"
        onClick={onClose}
        className="absolute left-5 top-5 rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
        title="Kembali">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                No. Resi
              </label>
              <input
                type="text"
                value={form.noResi}
                readOnly
                required
                className={`${inputClass} cursor-not-allowed bg-gray-100 text-gray-500`}
              />
              <p className="text-xs text-gray-400">
                Nomor resi dibuat otomatis saat tombol tambah pengiriman diklik.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Nama Pengirim
              </label>
              <input
                type="text"
                value={form.namaPengirim}
                onChange={(e) => handleChange("namaPengirim", e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center overflow-hidden rounded-xl border border-blue-300 transition-all focus-within:ring-2 focus-within:ring-blue-200">
                <span className="whitespace-nowrap border-r border-blue-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                  No.Telp
                </span>
                <div className="flex flex-1 items-center pl-3">
                  <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <input
                    type="tel"
                    value={form.noTelpPengirim}
                    onChange={(e) =>
                      handleChange("noTelpPengirim", e.target.value)
                    }
                    required
                    className="w-full bg-transparent py-3 pr-4 text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Vendor
              </label>
              <input
                type="text"
                value={form.vendor}
                onChange={(e) => handleChange("vendor", e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Driver
              </label>
              <input
                type="text"
                value={form.driver}
                onChange={(e) => handleChange("driver", e.target.value)}
                list="driver-options"
                required
                className={inputClass}
                placeholder={
                  isLoadingDrivers
                    ? "Memuat daftar driver..."
                    : "Masukkan nama driver terdaftar"
                }
              />
              <datalist id="driver-options">
                {driverNames.map((namaDriver) => (
                  <option key={namaDriver} value={namaDriver} />
                ))}
              </datalist>
              <p className="text-xs text-gray-400">
                Pengiriman hanya bisa disimpan bila nama driver tersedia di
                tabel profiles.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Nama Penerima
              </label>
              <input
                type="text"
                value={form.namaPenerima}
                onChange={(e) => handleChange("namaPenerima", e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center overflow-hidden rounded-xl border border-blue-300 transition-all focus-within:ring-2 focus-within:ring-blue-200">
                <span className="whitespace-nowrap border-r border-blue-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                  No.Telp
                </span>
                <div className="flex flex-1 items-center pl-3">
                  <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <input
                    type="tel"
                    value={form.noTelpPenerima}
                    onChange={(e) =>
                      handleChange("noTelpPenerima", e.target.value)
                    }
                    required
                    className="w-full bg-transparent py-3 pr-4 text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <AddressAutocomplete
                label="Alamat Asal"
                placeholder="Ketik alamat asal lalu pilih suggestion"
                value={form.alamatAsal}
                onChange={(value) => handleAddressChange("alamatAsal", value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <AddressAutocomplete
                label="Alamat Tujuan"
                placeholder="Ketik alamat tujuan lalu pilih suggestion"
                value={form.alamatTujuan}
                onChange={(value) =>
                  handleAddressChange("alamatTujuan", value)
                }
                required
              />
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs text-blue-700">
              Koordinat akan tersimpan otomatis setelah alamat dipilih dari
              suggestion Photon API.
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-70">
            <Save className="h-4 w-4" />
            {isSaving ? "Menyimpan..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

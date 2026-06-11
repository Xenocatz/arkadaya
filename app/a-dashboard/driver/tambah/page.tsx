"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { addDriverProfile } from "@/service/driver.service";
import {
  getUserFriendlyErrorMessage,
  logAppError,
} from "@/utils/error-message";

interface FormTambahDriver {
  nama: string;
  email: string;
  no_hp: string;
}

const FORM_AWAL: FormTambahDriver = {
  nama: "",
  email: "",
  no_hp: "",
};

export default function TambahDriverPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormTambahDriver>(FORM_AWAL);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof FormTambahDriver, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      if (!form.nama.trim()) {
        setError("Nama driver wajib diisi.");
        return;
      }

      if (!form.email.trim()) {
        setError("Email driver wajib diisi.");
        return;
      }

      if (!form.no_hp.trim()) {
        setError("Nomor telepon driver wajib diisi.");
        return;
      }

      const result = await addDriverProfile({
        nama: form.nama.trim(),
        email: form.email.trim(),
        no_hp: form.no_hp.trim(),
      });

      if (!result.success) {
        throw new Error(result.error ?? "Gagal menambahkan driver");
      }

      router.push("/a-dashboard/driver");
      router.refresh();
    } catch (err) {
      logAppError("Create driver failed", err);
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
            Tambah Driver
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Data akan disimpan ke tabel `profiles` dengan role `driver` dan akun
            login dibuat otomatis memakai password awal `driver2243`.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-blue-900 transition-all hover:bg-blue-50">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              Nama Driver
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              required
              className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan nama driver"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan email driver"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              No. Telp
            </label>
            <input
              type="tel"
              value={form.no_hp}
              onChange={(e) => handleChange("no_hp", e.target.value)}
              required
              className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan nomor telepon"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/a-dashboard/driver")}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
              <Save className="h-4 w-4" />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

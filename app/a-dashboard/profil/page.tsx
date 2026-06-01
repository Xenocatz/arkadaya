"use client";

import { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Save,
  User,
} from "lucide-react";
import { signOut } from "@/utils/auth";
import { useRouter } from "next/navigation";

// Data dummy profil pengguna
const PROFIL_DATA = {
  nama: "Admin Logistik",
  email: "admin@arkadaya.co.id",
  telepon: "+62 812-3456-7890",
  alamat: "Jl. Raya Depok No. 88, Depok, Jawa Barat",
  jabatan: "Super Admin",
  divisi: "Operasional & Logistik",
  bergabung: "01 Januari 2024",
  idKaryawan: "ARK-EMP-001",
};

/**
 * Halaman Profil pengguna.
 * Menampilkan informasi akun dan form edit data diri.
 */
export default function ProfilPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...PROFIL_DATA });
  const [saved, setSaved] = useState(false);

  // Tangani perubahan input form
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Simpan perubahan (simulasi)
  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    try {
      const res = await signOut();

      if (res.success) {
        router.push("/signin");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Judul Halaman */}
      <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
        Profil
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===================== Kartu Identitas Kiri ===================== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-8 flex flex-col items-center text-center space-y-4">
            {/* Avatar dengan tombol ganti foto */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center overflow-hidden shadow-md">
                {/* Placeholder avatar */}
                <User className="w-14 h-14 text-blue-400" />
              </div>
              <button
                className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
                title="Ganti foto profil">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Nama & Jabatan */}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{form.nama}</h2>
              <p className="text-sm text-blue-600 font-medium mt-1">
                {form.jabatan}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{form.divisi}</p>
            </div>

            {/* Badge ID Karyawan */}
            <div className="bg-blue-50 border border-blue-100 rounded-full px-5 py-2">
              <span className="text-xs font-semibold text-blue-700">
                {form.idKaryawan}
              </span>
            </div>

            {/* Tanggal bergabung */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 w-full text-center">
              Bergabung sejak{" "}
              <span className="font-medium text-gray-600">
                {form.bergabung}
              </span>
            </div>
          </div>
        </div>

        {/* ===================== Form Detail Kanan ===================== */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-8 space-y-6">
            {/* Header form */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Informasi Akun
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-full px-5 py-2 transition-all">
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm({ ...PROFIL_DATA });
                      setIsEditing(false);
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-full px-5 py-2 transition-all">
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full px-5 py-2 transition-all">
                    <Save className="w-4 h-4" />
                    Simpan
                  </button>
                </div>
              )}
            </div>

            {/* Notifikasi berhasil simpan */}
            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-5 py-3">
                ✅ Perubahan berhasil disimpan.
              </div>
            )}

            {/* Grid Field Form — 2 kolom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border transition-all outline-none ${
                      isEditing
                        ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-100"
                        : "border-gray-100 bg-gray-50 text-gray-700 cursor-default"
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border transition-all outline-none ${
                      isEditing
                        ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-100"
                        : "border-gray-100 bg-gray-50 text-gray-700 cursor-default"
                    }`}
                  />
                </div>
              </div>

              {/* Telepon */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.telepon}
                    onChange={(e) => handleChange("telepon", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border transition-all outline-none ${
                      isEditing
                        ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-100"
                        : "border-gray-100 bg-gray-50 text-gray-700 cursor-default"
                    }`}
                  />
                </div>
              </div>

              {/* Jabatan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jabatan
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.jabatan}
                    onChange={(e) => handleChange("jabatan", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border transition-all outline-none ${
                      isEditing
                        ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-100"
                        : "border-gray-100 bg-gray-50 text-gray-700 cursor-default"
                    }`}
                  />
                </div>
              </div>

              {/* Alamat — full width */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Alamat
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                  <textarea
                    value={form.alamat}
                    onChange={(e) => handleChange("alamat", e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border transition-all outline-none resize-none ${
                      isEditing
                        ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-100"
                        : "border-gray-100 bg-gray-50 text-gray-700 cursor-default"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kartu Keamanan Akun */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-8 mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Keamanan Akun
            </h2>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">Password</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Terakhir diubah 30 hari lalu
                </p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-full px-5 py-2 transition-all">
                Ubah Password
              </button>
            </div>
            <div className="flex items-center justify-end py-4">
              <button
                className="text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-400 rounded-full px-5 py-2 transition-all cursor-pointer"
                onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

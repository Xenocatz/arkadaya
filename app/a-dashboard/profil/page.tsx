"use client";

import { useRef, useState } from "react";
import { Camera, Mail, Phone, Save, User } from "lucide-react";
import { signOut } from "@/service/auth.service";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hook/useUserProfile";
import ProfileAvatar from "@/components/shared/ProfileAvatar";
import {
  updateUserProfile,
  uploadUserProfileAvatar,
} from "@/service/profile.service";
import { useQueryClient } from "@tanstack/react-query";

interface PROFIL_DATA {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  role: string;
  avatarUrl: string;
}

const DEFAULT_PROFIL: PROFIL_DATA = {
  id: "",
  nama: "",
  email: "",
  no_hp: "",
  role: "",
  avatarUrl: "",
};

export default function ProfilPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<PROFIL_DATA | null>(null);
  const [saved, setSaved] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileData =
    profile && "nama" in profile
      ? {
          id: profile.id ?? "",
          nama: profile.nama ?? "",
          email: profile.email ?? "",
          no_hp: profile.no_hp ?? "",
          role: profile.role ?? "",
          avatarUrl: profile.avatarUrl ?? "",
        }
      : DEFAULT_PROFIL;
  const currentProfile = form ?? profileData;

  const handleChange = (field: keyof PROFIL_DATA, value: string) => {
    setForm((prev) => ({
      ...(prev ?? profileData),
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await updateUserProfile(
        currentProfile.nama,
        currentProfile.no_hp,
      );
      const { success, profileData } = response as {
        success: boolean;
        profileData?: Partial<PROFIL_DATA>;
        error?: string;
      };

      if (!success) {
        throw new Error(response.error ?? "Gagal memperbarui data");
      }

      setForm((prev) => ({
        ...(prev ?? currentProfile),
        nama: profileData?.nama ?? prev?.nama ?? currentProfile.nama,
        no_hp: profileData?.no_hp ?? prev?.no_hp ?? currentProfile.no_hp,
      }));
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      setIsEditing(false);
      setForm(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setAvatarMessage("");
    setIsUploadingAvatar(true);

    try {
      const result = await uploadUserProfileAvatar(file);

      if (!result.success) {
        throw new Error(result.error ?? "Gagal mengunggah avatar.");
      }

      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setForm((prev) => ({
        ...(prev ?? profileData),
        avatarUrl:
          result.profileData?.avatarUrl ??
          prev?.avatarUrl ??
          profileData.avatarUrl,
      }));
      setAvatarMessage("Foto profil berhasil diperbarui.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("gagal upload avatar admin:", error);
      setAvatarMessage(
        error instanceof Error
          ? error.message
          : "Foto profil gagal diunggah. Silakan coba lagi.",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
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
              <ProfileAvatar
                key={currentProfile.avatarUrl || "admin-avatar-placeholder"}
                src={currentProfile.avatarUrl}
                alt="Foto profil admin"
                wrapperClassName="w-28 h-28 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center overflow-hidden shadow-md"
                imageClassName="h-full w-full object-cover"
                iconClassName="w-14 h-14 text-blue-400"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:scale-105 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:hover:scale-100"
                title="Ganti foto profil">
                {isUploadingAvatar ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">
                JPG, PNG, WEBP, GIF, AVIF. Maksimal 3 MB.
              </p>
              {isUploadingAvatar ? (
                <p className="text-xs font-semibold text-blue-600">
                  Mengunggah foto profil...
                </p>
              ) : null}
              {avatarMessage ? (
                <p
                  className={`text-xs font-semibold ${
                    avatarMessage.includes("berhasil")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}>
                  {avatarMessage}
                </p>
              ) : null}
            </div>

            {/* Nama */}
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {currentProfile.nama}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {currentProfile.role}
              </p>
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
                  onClick={() => {
                    setForm(profileData);
                    setIsEditing(true);
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-full px-5 py-2 transition-all">
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm(null);
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
                    value={currentProfile.nama}
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
                    value={currentProfile.email}
                    disabled
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border transition-all outline-none border-gray-100 bg-gray-50 text-gray-700 cursor-default`}
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
                    value={currentProfile.no_hp}
                    onChange={(e) => handleChange("no_hp", e.target.value)}
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
              {/* <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Alamat
                </label> */}
              {/* <div className="relative">
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
                </div> */}
              {/* </div> */}
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

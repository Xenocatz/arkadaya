"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, LogOut, Mail, Pencil, Phone } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { signOut } from "@/service/auth.service";
import { useUserProfile } from "@/hook/useUserProfile";
import { updateUserProfile } from "@/service/profile.service";

interface EditableProfile {
  nama: string;
  no_hp: string;
}

interface AvatarProfile {
  avatarUrl: string;
}

const defaultAvatarProfile: AvatarProfile = {
  avatarUrl: "/profile_avatar.png",
};

const loadStoredAvatar = (): AvatarProfile => {
  if (typeof window === "undefined") {
    return defaultAvatarProfile;
  }

  const saved = window.localStorage.getItem("arkadaya_profile_avatar");
  if (!saved) return defaultAvatarProfile;

  try {
    return JSON.parse(saved) as AvatarProfile;
  } catch (error) {
    console.error(error);
    return defaultAvatarProfile;
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading, isError } = useUserProfile();
  const [avatarProfile, setAvatarProfile] = useState<AvatarProfile>(loadStoredAvatar);
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState<EditableProfile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = userProfile && "nama" in userProfile ? userProfile : null;
  const formValues = draftProfile ?? {
    nama: profile?.nama ?? "",
    no_hp: profile?.no_hp ?? "",
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDraftProfile((prev) => ({
      nama: prev?.nama ?? profile?.nama ?? "",
      no_hp: prev?.no_hp ?? profile?.no_hp ?? "",
      [name]: value,
    }));
  };

  const handleEditClick = async () => {
    if (isEditing) {
      if (!draftProfile) {
        setIsEditing(false);
        return;
      }

      setIsSaving(true);

      try {
        const result = await updateUserProfile(draftProfile.nama, draftProfile.no_hp);

        if (!result.success) {
          throw new Error(result.error ?? "Profil gagal diperbarui.");
        }

        await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        setIsEditing(false);
        setDraftProfile(null);
        window.alert("Profil berhasil diperbarui!");
      } catch (error) {
        console.error("gagal update profil customer:", error);
        window.alert("Profil gagal diperbarui. Silakan coba lagi.");
      } finally {
        setIsSaving(false);
      }

      return;
    }

    setDraftProfile({
      nama: profile?.nama ?? "",
      no_hp: profile?.no_hp ?? "",
    });
    setIsEditing(true);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const avatarUrl = reader.result as string;
      setAvatarProfile((prev) => {
        const updated = { ...prev, avatarUrl };
        localStorage.setItem("arkadaya_profile_avatar", JSON.stringify(updated));
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      const result = await signOut();

      if (!result.success) {
        throw new Error(result.error);
      }

      router.push(CUSTOMER_ROUTES.login);
    } catch (error) {
      console.error("gagal logout customer:", error);
      window.alert("Logout gagal. Silakan coba lagi.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCancelEdit = () => {
    setDraftProfile(null);
    setIsEditing(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-0 sm:p-4 md:p-8">
      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col justify-between overflow-hidden border border-slate-100 bg-white p-6 transition-all duration-500 sm:my-4 sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] sm:shadow-2xl">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link
              href={CUSTOMER_ROUTES.order}
              className="rounded-full p-1.5 text-[#05336b] transition-all hover:bg-slate-100"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <span className="text-lg font-extrabold tracking-wide text-[#05336b]">Profile</span>
          </div>

          <div className="flex items-center gap-1">
            <svg
              className="h-6 w-6 text-[#05336b]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            </svg>
            <span className="text-xs font-black tracking-tight text-[#05336b]">ARKADAYA</span>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto py-4">
          <div className="relative mx-auto mb-5 h-32 w-32">
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#05336b]/10 bg-slate-100 shadow-md">
              <img
                src={avatarProfile.avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#05336b] bg-[#75b2ce] text-slate-800 shadow-md transition-all hover:bg-[#64a1bd] active:scale-[0.9]"
            >
              <Pencil size={16} strokeWidth={2.2} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="mb-8 px-4 text-center">
            {isLoading ? (
              <p className="text-sm font-semibold text-slate-500">Memuat profil...</p>
            ) : null}
            {isError ? (
              <p className="text-sm font-semibold text-red-500">
                Gagal memuat data profil dari Supabase.
              </p>
            ) : null}
            {isEditing ? (
              <input
                type="text"
                name="nama"
                value={formValues.nama}
                onChange={handleInputChange}
                className="mx-auto block w-full max-w-[240px] border-b-2 border-[#05336b] bg-transparent py-1 text-center text-xl font-bold text-slate-900 outline-none transition-colors focus:border-blue-500"
                placeholder="Nama Lengkap"
              />
            ) : (
              <h2 className="text-[25px] font-black leading-tight text-slate-900">
                {profile?.nama ?? "-"}
              </h2>
            )}
            <p className="mt-1.5 text-sm font-semibold tracking-wider text-slate-500">
              {profile?.role ?? "-"}
            </p>
          </div>

          <div className="space-y-5 px-1">
            <div className="flex items-center gap-4 rounded-full border border-blue-900 bg-[#e3f0ff] px-6 py-3.5 shadow-md shadow-blue-100/40">
              <Mail size={22} className="shrink-0 text-[#05336b]" strokeWidth={2.2} />
              <span className="truncate text-sm font-bold text-[#05336b]">
                {profile?.email ?? "-"}
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-full border border-blue-900 bg-[#e3f0ff] px-6 py-3.5 shadow-md shadow-blue-100/40">
              <Phone size={22} className="shrink-0 text-[#05336b]" strokeWidth={2.2} />
              {isEditing ? (
                <input
                  type="tel"
                  name="no_hp"
                  value={formValues.no_hp}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-sm font-bold text-[#05336b] outline-none placeholder:text-[#05336b]/40"
                  placeholder="Nomor Telepon"
                />
              ) : (
                <span className="text-sm font-bold text-[#05336b]">{profile?.no_hp ?? "-"}</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-2 pt-6">
          {isEditing ? (
            <button
              onClick={handleCancelEdit}
              className="flex h-14 w-full items-center justify-center rounded-full border border-slate-300 bg-white text-base font-bold text-slate-700 shadow-md transition-all duration-300 hover:bg-slate-50 active:scale-[0.98]"
            >
              Batal
            </button>
          ) : null}
          <button
            onClick={handleEditClick}
            className={`flex h-14 w-full items-center justify-center gap-2 rounded-full border text-base font-bold shadow-md transition-all duration-300 active:scale-[0.98] ${
              isEditing
                ? "border-emerald-800 bg-emerald-600 text-white hover:bg-emerald-700"
                : "border-amber-900 bg-[#f7dfb5] text-slate-900 hover:bg-[#eccba2]"
            }`}
          >
            {isEditing ? (
              <>
                <Check size={18} strokeWidth={2.5} />
                {isSaving ? "Menyimpan..." : "Save Changes"}
              </>
            ) : (
              "Edit"
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-red-950 bg-[#ee3124] text-base font-bold text-white shadow-md shadow-red-100 transition-all duration-300 hover:bg-[#d92317] active:scale-[0.98]"
          >
            <LogOut size={18} strokeWidth={2.5} />
            {isSigningOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, User, Menu } from "lucide-react";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import { useUserProfile } from "@/hook/useUserProfile";

interface HeaderProps {
  onToggleSidebar: () => void;
}
interface ProfileData {
  nama: string;
  role: string;
}
const defaultProfile: ProfileData = {
  nama: "",
  role: "",
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  // State untuk membuka/menutup panel notifikasi
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { data: profileData } = useUserProfile();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    if (profileData && "nama" in profileData) {
      setProfile({
        nama: profileData.nama ?? "",
        role: profileData.role ?? "",
      });
    }
  }, [profileData]);
  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        {/* Bagian kiri: Toggle Sidebar */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-500 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-all mr-4">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Bagian kanan: Search, Notifikasi & Profil */}
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative w-64 hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </span>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-4 text-xs text-navy-900 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
              placeholder="No resi, Driver, Tanggal"
            />
          </div>

          {/* Tombol Notifikasi — klik membuka NotificationPanel */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            title="Notifikasi">
            <Bell className="w-6 h-6" />
            {/* Badge merah penanda ada notifikasi baru */}
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
          </button>

          {/* Avatar & Profil Pengguna */}
          <Link
            href="/a-dashboard/profil"
            className="flex items-center space-x-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-navy-900 group-hover:text-blue-600 transition-colors">
                {profile.nama}
              </p>
              <p className="text-xs text-gray-500">{profile.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
              <User className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </header>

      {/* Panel Notifikasi — ditampilkan di atas semua elemen */}
      {isNotifOpen && (
        <NotificationPanel onClose={() => setIsNotifOpen(false)} />
      )}
    </>
  );
};

export default Header;

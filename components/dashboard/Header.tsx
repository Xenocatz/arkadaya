"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import { useAdminNotifications } from "@/hook/useAdminNotifications";
import { useUserProfile } from "@/hook/useUserProfile";
import ProfileAvatar from "@/components/shared/ProfileAvatar";

interface HeaderProps {
  onToggleSidebar: () => void;
}

// Komponen input pencarian global yang disinkronkan dengan URL
const GlobalSearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [value, setValue] = useState(initialSearch);

  // Sinkronkan input dengan perubahan parameter URL secara real-time
  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }

    const searchablePages = [
      "/a-dashboard",
      "/a-dashboard/pengiriman",
      "/a-dashboard/driver",
      "/a-dashboard/lacak",
      "/a-dashboard/laporan",
    ];

    const currentPath = pathname;

    // Periksa apakah halaman aktif termasuk yang memiliki fitur pencarian
    const isSearchable = searchablePages.some((page) => {
      if (page === "/a-dashboard") {
        return currentPath === "/a-dashboard";
      }
      return currentPath.startsWith(page);
    });

    if (isSearchable) {
      router.replace(`${currentPath}?${params.toString()}`);
    } else {
      // Jika di halaman non-searchable, arahkan ke daftar pengiriman
      router.push(`/a-dashboard/pengiriman?${params.toString()}`);
    }
  };

  return (
    <div className="relative w-64 hidden md:block">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="block w-full py-2 pl-10 pr-4 text-xs text-navy-900 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
        placeholder="No resi, Driver, Tanggal"
      />
    </div>
  );
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  // State untuk membuka/menutup panel notifikasi
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { data: profileData } = useUserProfile();
  const { data: notifications = [] } = useAdminNotifications();
  const profile = {
    nama: profileData && "nama" in profileData ? (profileData.nama ?? "") : "",
    role: profileData && "role" in profileData ? (profileData.role ?? "") : "",
  };

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
          {/* Search Bar dengan Suspense agar aman saat static build */}
          <Suspense
            fallback={
              <div className="relative w-64 hidden md:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  className="block w-full py-2 pl-10 pr-4 text-xs text-navy-900 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none animate-pulse"
                  placeholder="No resi, Driver, Tanggal"
                  disabled
                />
              </div>
            }
          >
            <GlobalSearchInput />
          </Suspense>

          {/* Tombol Notifikasi — klik membuka NotificationPanel */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            title="Notifikasi">
            <Bell className="w-6 h-6" />
            {/* Badge merah penanda ada notifikasi baru */}
            {notifications.length > 0 ? (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            ) : null}
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
            <ProfileAvatar
              key={
                profileData && "avatarUrl" in profileData && profileData.avatarUrl
                  ? profileData.avatarUrl
                  : "header-avatar-placeholder"
              }
              src={profileData && "avatarUrl" in profileData ? profileData.avatarUrl : null}
              alt="Foto profil admin"
              wrapperClassName="w-10 h-10 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm"
              imageClassName="h-full w-full object-cover"
              iconClassName="w-6 h-6"
            />
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

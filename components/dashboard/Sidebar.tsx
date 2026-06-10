"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Home, Package, Truck, BarChart3, Search, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Daftar item menu dengan path tujuannya
const menuItems = [
  { icon: User, label: "Profil", href: "/a-dashboard/profil" },
  { icon: Home, label: "Dashboard", href: "/a-dashboard" },
  { icon: Search, label: "Lacak Paket", href: "/a-dashboard/lacak" },
  {
    icon: Package,
    label: "Pengiriman Barang",
    href: "/a-dashboard/pengiriman",
  },
  { icon: Truck, label: "Manajemen Driver", href: "/a-dashboard/driver" },
  { icon: BarChart3, label: "Laporan", href: "/a-dashboard/laporan" },
];

/**
 * Komponen Sidebar untuk navigasi utama.
 * Menggunakan usePathname() untuk menentukan menu yang aktif secara dinamis.
 */
const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  /**
   * Menentukan apakah sebuah menu item aktif berdasarkan pathname saat ini.
   * Dashboard (/dashboard) hanya aktif jika path-nya persis sama.
   */
  const isActive = (href: string) => {
    if (href === "/a-dashboard") {
      return pathname === "/a-dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay gelap semi-transparan untuk tampilan mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Kontainer Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white w-72 z-50 transition-transform duration-300 ease-in-out border-r border-gray-100 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Bagian Logo */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-navy-900 font-bold text-xl flex items-center">
              <Truck className="w-8 h-8 text-blue-600 mr-2" />
              <div className="leading-tight">
                <span className="block text-blue-600 tracking-wider">
                  ARKADAYA
                </span>
                <span className="text-[10px] text-gray-400 font-normal uppercase tracking-[0.2em]">
                  Express Logistics
                </span>
              </div>
            </div>
          </div>
          {/* Tombol tutup untuk tampilan mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-navy-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Daftar Menu Navigasi */}
        <nav className="px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-navy-900"
                }`}>
                <item.icon
                  className={`w-6 h-6 ${
                    active ? "text-white" : "text-gray-400"
                  }`}
                />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

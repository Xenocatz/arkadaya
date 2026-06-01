import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: "pink" | "blue" | "yellow" | "green";
  description?: string;
}

/**
 * Komponen StatCard untuk menampilkan metrik dashboard.
 * Memiliki varian warna yang berbeda untuk ikon dan background ikon.
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  variant,
  description,
}: StatCardProps) => {
  // Mapping warna berdasarkan varian
  const variants = {
    pink: {
      bg: "bg-pink-50",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    yellow: {
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    green: {
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
  };

  const selectedVariant = variants[variant];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center space-x-4 hover:shadow-md transition-shadow">
      {/* Box Ikon dengan sudut membulat */}
      <div
        className={`${selectedVariant.iconBg} p-4 rounded-2xl flex items-center justify-center`}>
        <Icon className={`w-8 h-8 ${selectedVariant.iconColor}`} />
      </div>

      {/* Konten Teks */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-navy-900">{value}</h3>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

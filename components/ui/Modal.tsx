"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  /** Judul modal yang ditampilkan di bagian atas */
  title: string;
  /** Konten form di dalam modal */
  children: ReactNode;
  /** Callback untuk menutup modal */
  onClose: () => void;
  /** Lebar modal, default 'md' */
  size?: "sm" | "md" | "lg";
}

/**
 * Komponen Modal reusable dengan overlay dan animasi.
 * Menutup diri sendiri saat klik overlay atau tekan Escape.
 */
export default function Modal({ title, children, onClose, size = "md" }: ModalProps) {
  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    // Mencegah scroll di belakang modal
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Ukuran panel modal
  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-3xl",
  }[size];

  return (
    // Overlay gelap
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Panel modal — klik di dalam tidak menutup */}
      <div
        className={`relative w-full ${sizeClass} mx-4 bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol tutup (X) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Judul Modal */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-extrabold text-blue-900">{title}</h2>
        </div>

        {/* Konten */}
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}

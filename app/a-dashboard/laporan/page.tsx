"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getLaporanList,
  type LaporanItem,
  type StatusLaporan,
} from "@/service/laporan.service";

const statusOptions: Array<StatusLaporan | "Semua"> = [
  "Semua",
  "Selesai",
  "Dalam Pengiriman",
  "Dibatalkan",
  "Pending",
];

function getStatusColor(status: StatusLaporan): string {
  switch (status) {
    case "Selesai":
      return "text-green-500";
    case "Dalam Pengiriman":
      return "text-blue-500";
    case "Dibatalkan":
      return "text-red-500";
    case "Pending":
      return "text-orange-400";
    default:
      return "text-gray-500";
  }
}

export default function LaporanPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadLaporan = async () => {
      if (!isMounted) {
        return;
      }

      const result = await getLaporanList();

      if (!isMounted) {
        return;
      }

      if (!result.success) {
        setError(result.error ?? "Gagal memuat laporan");
        setLaporan([]);
        setIsLoading(false);
        return;
      }

      setError("");
      setLaporan(result.data);
      setIsLoading(false);
    };

    void loadLaporan();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = laporan.filter((item) => {
    const keyword = query.toLowerCase();
    const cocokQuery =
      query === "" ||
      item.noResi.toLowerCase().includes(keyword) ||
      item.pengirim.toLowerCase().includes(keyword) ||
      item.penerima.toLowerCase().includes(keyword) ||
      item.driver.toLowerCase().includes(keyword);

    const cocokStatus =
      statusFilter === "Semua" || item.status === statusFilter;

    return cocokQuery && cocokStatus;
  });

  const handleExportPdf = () => {
    if (filteredData.length === 0) {
      window.alert("Tidak ada data laporan untuk diekspor.");
      return;
    }

    setIsExporting(true);

    try {
      const tanggalEksporLabel = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
      const tanggalFile = new Intl.DateTimeFormat("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(new Date())
        .replaceAll("-", "");

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Laporan Pengiriman", 40, 42);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Diekspor pada ${tanggalEksporLabel}`, 40, 60);
      doc.text(
        `Jumlah data: ${filteredData.length} | Filter status: ${statusFilter} | Kata kunci: ${query || "Semua data"}`,
        40,
        75,
      );

      autoTable(doc, {
        startY: 95,
        head: [
          [
            "No",
            "No. Resi",
            "Pengirim",
            "Penerima",
            "Driver",
            "Tanggal",
            "Status",
          ],
        ],
        body: filteredData.map((item, index) => [
          index + 1,
          item.noResi,
          item.pengirim,
          item.penerima,
          item.driver,
          item.tanggal,
          item.status,
        ]),
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 6,
          textColor: [31, 41, 55],
          lineColor: [226, 232, 240],
          lineWidth: 0.5,
          valign: "middle",
        },
        headStyles: {
          fillColor: [239, 246, 255],
          textColor: [30, 58, 138],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 30, halign: "center" },
          1: { cellWidth: 100 },
          2: { cellWidth: 120 },
          3: { cellWidth: 120 },
          4: { cellWidth: 100 },
          5: { cellWidth: 90 },
          6: { cellWidth: 80, halign: "right" },
        },
        margin: { top: 95, right: 40, bottom: 40, left: 40 },
        didDrawPage: () => {
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(9);
          doc.setTextColor(148, 163, 184);
          doc.text(
            `Arkadaya Logistic`,
            40,
            pageHeight - 18,
          );
          doc.text(
            `Halaman ${doc.getNumberOfPages()}`,
            doc.internal.pageSize.getWidth() - 80,
            pageHeight - 18,
          );
        },
      });

      doc.save(`laporan-pengiriman-${tanggalFile}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
          Laporan
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Rekap pengiriman diambil langsung dari tabel `pengiriman`.
        </p>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[200px] flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-blue-100 bg-blue-50 py-3 pl-5 pr-12 text-sm text-gray-700 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
              <Search className="h-4 w-4" />
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-blue-100">
              <span>{statusFilter === "Semua" ? "Status" : statusFilter}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {isDropdownOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setStatusFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full px-5 py-3 text-left text-sm transition-colors ${
                      statusFilter === option
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isLoading || isExporting || filteredData.length === 0}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
            <Download className="h-4 w-4" />
            <span>{isExporting ? "Menyiapkan PDF..." : "Ekspor PDF"}</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white pb-6 shadow-sm">
        <div className="px-8 py-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Rekap Pengiriman
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-sm">
            <thead>
              <tr>
                <th className="w-[18%] px-8 pb-4 text-left text-sm font-semibold text-gray-700">
                  No. Resi
                </th>
                <th className="w-[18%] px-6 pb-4 text-left text-sm font-semibold text-gray-700">
                  Pengirim
                </th>
                <th className="w-[18%] px-6 pb-4 text-left text-sm font-semibold text-gray-700">
                  Penerima
                </th>
                <th className="w-[16%] px-6 pb-4 text-left text-sm font-semibold text-gray-700">
                  Driver
                </th>
                <th className="w-[16%] px-6 pb-4 text-left text-sm font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="w-[14%] px-6 pb-4 pr-8 text-right text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="align-top">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400">
                    Memuat laporan...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.noResi}
                    className="group border-t border-gray-100 first:border-t-0">
                    <td className="px-8 py-4 text-sm font-normal text-gray-700">
                      <div className="truncate">{item.noResi}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="truncate">{item.pengirim}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="truncate">{item.penerima}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="truncate">{item.driver}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="truncate">{item.tanggal}</div>
                    </td>
                    <td className="px-6 py-4 pr-8 text-right">
                      <span
                        className={`inline-block text-sm font-medium ${getStatusColor(
                          item.status,
                        )}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}

              {!isLoading && !error && filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400">
                    Tidak ada laporan ditemukan.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

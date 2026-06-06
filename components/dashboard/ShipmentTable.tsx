import Link from "next/link";
import { Package } from "lucide-react";

export interface ShipmentTableItem {
  resi: string;
  customer: string;
  destination: string;
  status: string;
  date: string;
}

interface ShipmentTableProps {
  items: ShipmentTableItem[];
}

const ShipmentTable = ({ items }: ShipmentTableProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Dalam Pengiriman":
        return "text-blue-600 bg-blue-50";
      case "Terkirim":
        return "text-yellow-600 bg-yellow-50";
      case "Selesai":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-50 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-xl font-bold text-navy-900">
          Daftar Pengiriman Terbaru
        </h2>
        <Link
          href="/a-dashboard/pengiriman"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                No. Resi
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tujuan
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Belum ada data pengiriman.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.resi}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-navy-50 p-2">
                        <Package className="h-4 w-4 text-navy-600" />
                      </div>
                      <span className="font-semibold text-navy-900">
                        {item.resi}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.destination}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentTable;

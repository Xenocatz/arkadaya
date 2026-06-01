import React from 'react';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

// Interface untuk data pengiriman
interface Shipment {
  id: string;
  resi: string;
  customer: string;
  destination: string;
  status: 'Dalam Pengiriman' | 'Terkirim' | 'Pending' | 'Selesai';
  date: string;
}

// Data mocking untuk tabel
const SHIPMENT_DATA: Shipment[] = [
  { id: '1', resi: 'ARK-2024-001', customer: 'Budi Santoso', destination: 'Jakarta Utara', status: 'Dalam Pengiriman', date: '02 Mei 2026' },
  { id: '2', resi: 'ARK-2024-002', customer: 'Siti Aminah', destination: 'Bandung, Jawa Barat', status: 'Terkirim', date: '01 Mei 2026' },
  { id: '3', resi: 'ARK-2024-003', customer: 'Andi Wijaya', destination: 'Surabaya, Jawa Timur', status: 'Selesai', date: '30 Apr 2026' },
  { id: '4', resi: 'ARK-2024-004', customer: 'Dewi Lestari', destination: 'Medan, Sumatera Utara', status: 'Pending', date: '02 Mei 2026' },
  { id: '5', resi: 'ARK-2024-005', customer: 'Rudi Hermawan', destination: 'Yogyakarta', status: 'Dalam Pengiriman', date: '01 Mei 2026' },
  { id: '6', resi: 'ARK-2024-006', customer: 'Lani Marlina', destination: 'Semarang, Jawa Tengah', status: 'Terkirim', date: '30 Apr 2026' },
];

/**
 * Komponen ShipmentTable untuk menampilkan daftar resi pengiriman.
 */
const ShipmentTable = () => {
  // Fungsi untuk mendapatkan warna status
  const getStatusStyle = (status: Shipment['status']) => {
    switch (status) {
      case 'Dalam Pengiriman': return 'text-blue-600 bg-blue-50';
      case 'Terkirim': return 'text-yellow-600 bg-yellow-50';
      case 'Selesai': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy-900">Daftar Pengiriman Terbaru</h2>
        <button className="text-sm font-medium text-blue-600 hover:underline">Lihat Semua</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Resi</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tujuan</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SHIPMENT_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-navy-50 rounded-lg">
                      <Package className="w-4 h-4 text-navy-600" />
                    </div>
                    <span className="font-semibold text-navy-900">{item.resi}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.destination}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentTable;

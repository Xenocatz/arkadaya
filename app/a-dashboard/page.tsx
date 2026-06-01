import StatCard from "@/components/dashboard/StatCard";
import ShipmentTable from "@/components/dashboard/ShipmentTable";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

/**
 * Halaman utama Dashboard Logistik.
 * Layout (Sidebar + Header) sudah disediakan oleh app/dashboard/layout.tsx.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Judul Halaman */}
      <div>
        <h1 className="text-6xl font-extrabold text-navy-900 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Kartu Statistik — 4 Kolom */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pengiriman"
          value="3,456"
          icon={Package}
          variant="pink"
          description="Total paket bulan ini"
        />
        <StatCard
          title="Dalam Pengiriman"
          value="892"
          icon={Truck}
          variant="blue"
          description="Paket sedang di perjalanan"
        />
        <StatCard
          title="Paket Terkirim"
          value="2,145"
          icon={CheckCircle}
          variant="yellow"
          description="Paket sampai di tujuan"
        />
        <StatCard
          title="Selesai"
          value="419"
          icon={Clock}
          variant="green"
          description="Konfirmasi diterima"
        />
      </section>

      {/* Tabel & Grafik — Grid 2 Kolom */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tabel Pengiriman (kiri, ~65%) */}
        <div className="lg:col-span-8">
          <ShipmentTable />
        </div>

        {/* Donut Chart (kanan, ~35%) */}
        <div className="lg:col-span-4">
          <AnalyticsChart />
        </div>
      </section>
    </div>
  );
}

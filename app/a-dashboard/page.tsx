import StatCard from "@/components/dashboard/StatCard";
import ShipmentTable from "@/components/dashboard/ShipmentTable";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { getDashboardData } from "@/service/dashboard.service";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await props.searchParams;
  const search = params.search ?? "";

  const {
    totalPengiriman,
    totalDalamPengiriman,
    totalTerkirim,
    totalSelesai,
    latestShipment,
    chartData,
    efficiency,
  } = await getDashboardData();

  // Saring daftar pengiriman terbaru berdasarkan kata kunci pencarian
  let filteredShipments = latestShipment;
  if (search) {
    const q = search.toLowerCase();
    filteredShipments = latestShipment.filter((item) => {
      return (
        item.resi.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.destination.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q)
      );
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-6xl font-extrabold tracking-tight text-navy-900">
          Dashboard
        </h1>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pengiriman"
          value={totalPengiriman}
          icon={Package}
          variant="pink"
          description="Total data dari tabel pengiriman"
        />
        <StatCard
          title="Dalam Pengiriman"
          value={totalDalamPengiriman}
          icon={Truck}
          variant="blue"
          description="Paket sedang di perjalanan"
        />
        <StatCard
          title="Paket Terkirim"
          value={totalTerkirim}
          icon={CheckCircle}
          variant="yellow"
          description="Paket berstatus terkirim"
        />
        <StatCard
          title="Selesai"
          value={totalSelesai}
          icon={Clock}
          variant="green"
          description="Paket berstatus selesai"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ShipmentTable items={filteredShipments} />
        </div>

        <div className="lg:col-span-4">
          <AnalyticsChart
            data={chartData}
            total={totalPengiriman}
            efficiency={efficiency}
          />
        </div>
      </section>
    </div>
  );
}

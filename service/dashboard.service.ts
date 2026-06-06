import { createClient } from "@/lib/supabase/server";
import type { ShipmentTableItem } from "@/components/dashboard/ShipmentTable";

interface PengirimanDashboardRow {
  no_resi?: string | null;
  nama_pengirim?: string | null;
  alamat_tujuan?: string | null;
  alamat?: string | null;
  status?: string | null;
  created_at?: string | null;
}

interface DashboardChartItem {
  name: string;
  value: number;
  color: string;
}

export interface DashboardData {
  totalPengiriman: number;
  totalDalamPengiriman: number;
  totalTerkirim: number;
  totalSelesai: number;
  latestShipment: ShipmentTableItem[];
  chartData: DashboardChartItem[];
  efficiency: string;
}

function normalizeStatus(status?: string | null) {
  const normalizedStatus = status?.trim().toLowerCase();

  switch (normalizedStatus) {
    case "in transit":
    case "dalam pengiriman":
    case "dalam perjalanan":
      return "Dalam Pengiriman";
    case "terkirim":
    case "delivered":
      return "Terkirim";
    case "selesai":
      return "Selesai";
    case "pending":
      return "Pending";
    default:
      return "Pending";
  }
}

function formatTanggal(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getSortTimestamp(row: PengirimanDashboardRow) {
  return new Date(row.created_at ?? 0).getTime();
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pengiriman")
    .select("no_resi, nama_pengirim, alamat_tujuan, status, created_at");

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return {
      totalPengiriman: 0,
      totalDalamPengiriman: 0,
      totalTerkirim: 0,
      totalSelesai: 0,
      latestShipment: [],
      chartData: [],
      efficiency: "0%",
    };
  }
  const pengiriman = ((data as PengirimanDashboardRow[] | null) ?? []).sort(
    (a, b) => getSortTimestamp(b) - getSortTimestamp(a),
  );

  const totalPengiriman = pengiriman.length;
  const totalDalamPengiriman = pengiriman.filter(
    (item) => normalizeStatus(item.status) === "Dalam Pengiriman",
  ).length;
  const totalTerkirim = pengiriman.filter(
    (item) => normalizeStatus(item.status) === "Terkirim",
  ).length;
  const totalSelesai = pengiriman.filter(
    (item) => normalizeStatus(item.status) === "Selesai",
  ).length;
  const totalPending = pengiriman.filter(
    (item) => normalizeStatus(item.status) === "Pending",
  ).length;

  const latestShipment: ShipmentTableItem[] = pengiriman
    .slice(0, 6)
    .map((item) => ({
      resi: item.no_resi ?? "-",
      customer: item.nama_pengirim ?? "-",
      destination: item.alamat_tujuan ?? item.alamat ?? "-",
      status: normalizeStatus(item.status),
      date: formatTanggal(item.created_at),
    }));

  const chartData: DashboardChartItem[] = [
    { name: "Selesai", value: totalSelesai, color: "#22c55e" },
    {
      name: "Dalam Pengiriman",
      value: totalDalamPengiriman,
      color: "#3b82f6",
    },
    { name: "Terkirim", value: totalTerkirim, color: "#eab308" },
    { name: "Pending", value: totalPending, color: "#ec4899" },
  ].filter((item) => item.value > 0);

  const efficiency =
    totalPengiriman === 0
      ? "0%"
      : `${Math.round(((totalTerkirim + totalSelesai) / totalPengiriman) * 100)}%`;

  return {
    totalPengiriman,
    totalDalamPengiriman,
    totalTerkirim,
    totalSelesai,
    latestShipment,
    chartData,
    efficiency,
  };
}

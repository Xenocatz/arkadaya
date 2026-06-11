import { createClient } from "@/lib/supabase/client";
import { logAppError } from "@/utils/error-message";

const supabase = createClient();

export type StatusLaporan =
  | "Selesai"
  | "Dalam Pengiriman"
  | "Dibatalkan"
  | "Pending";

export interface LaporanItem {
  noResi: string;
  pengirim: string;
  penerima: string;
  driver: string;
  tanggal: string;
  status: StatusLaporan;
}

interface LaporanRow {
  no_resi?: string | null;
  noResi?: string | null;
  nama_pengirim?: string | null;
  pengirim?: string | null;
  nama_penerima?: string | null;
  penerima?: string | null;
  driver?: string | null;
  status?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}

function formatTanggal(value?: string | null): string {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeStatus(status?: string | null): StatusLaporan {
  const normalizedStatus = status?.trim().toLowerCase();

  switch (normalizedStatus) {
    case "selesai":
    case "terkirim":
    case "delivered":
      return "Selesai";
    case "in transit":
    case "dalam pengiriman":
    case "dalam perjalanan":
      return "Dalam Pengiriman";
    case "dibatalkan":
    case "canceled":
    case "cancelled":
      return "Dibatalkan";
    case "pending":
      return "Pending";
    default:
      return "Pending";
  }
}

function mapLaporan(row: LaporanRow): LaporanItem {
  return {
    noResi: row.no_resi ?? row.noResi ?? "-",
    pengirim: row.nama_pengirim ?? row.pengirim ?? "-",
    penerima: row.nama_penerima ?? row.penerima ?? "-",
    driver: row.driver ?? "-",
    tanggal: formatTanggal(row.updated_at ?? row.created_at),
    status: normalizeStatus(row.status),
  };
}

function getSortTimestamp(row: LaporanRow) {
  return new Date(row.updated_at ?? row.created_at ?? 0).getTime();
}

export async function getLaporanList() {
  const { data, error } = await supabase
    .from("pengiriman")
    .select("no_resi, nama_pengirim, nama_penerima, driver, status, created_at");

  if (error) {
    logAppError("Get report list failed", error);
    return {
      success: false,
      error: error.message,
      data: [] as LaporanItem[],
    };
  }

  const mappedData = ((data as LaporanRow[] | null) ?? [])
    .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a))
    .map(mapLaporan);

  return {
    success: true,
    data: mappedData,
  };
}

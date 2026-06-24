import { createClient } from "@/lib/supabase/client";
import { logAppError } from "@/utils/error-message";

const supabase = createClient();

export interface PengirimanInput {
  noResi: string;
  namaPengirim: string;
  noTelpPengirim: string;
  vendor: string;
  driver: string;
  namaPenerima: string;
  noTelpPenerima: string;
  alamatAsal: string;
  asalLat: number;
  asalLng: number;
  alamatTujuan: string;
  tujuanLat: number;
  tujuanLng: number;
}

export interface PengirimanAddressDraft {
  address: string;
  lat: number | null;
  lng: number | null;
}

export interface PengirimanFormInput {
  noResi: string;
  namaPengirim: string;
  noTelpPengirim: string;
  vendor: string;
  driver: string;
  namaPenerima: string;
  noTelpPenerima: string;
  alamatAsal: PengirimanAddressDraft;
  alamatTujuan: PengirimanAddressDraft;
}

export interface PengirimanItem {
  id: string;
  noResi: string;
  pengirim: string;
  noTelpPengirim: string;
  vendor: string;
  penerima: string;
  noTelpPenerima: string;
  alamatAsal: string;
  alamat: string;
  status: string;
  driver: string;
  update: string;
  estimatedArrival: string | null;
  asalLat: number | null;
  asalLng: number | null;
  tujuanLat: number | null;
  tujuanLng: number | null;
  currentLocation: string | null;
}

interface DetailPengirimanRow {
  estimasi_sampai?: string | null;
}

// Menyimpan riwayat tracking pengiriman
interface TrackingPengirimanRow {
  id_tracking?: number | null;
  status?: string | null;
  waktu?: string | null;
  lokasi?: string | null;
  keterangan?: string | null;
  created_at?: string | null;
}

interface PengirimanRow {
  id?: string | number | null;
  id_pengiriman?: string | number | null;
  no_resi?: string | null;
  noResi?: string | null;
  nama_pengirim?: string | null;
  pengirim?: string | null;
  no_hp_pengirim?: string | null;
  vendor?: string | null;
  nama_penerima?: string | null;
  penerima?: string | null;
  no_hp_penerima?: string | null;
  alamat?: string | null;
  alamat_asal?: string | null;
  alamat_tujuan?: string | null;
  status?: string | null;
  driver?: string | null;
  asal_lat?: number | null;
  asal_lng?: number | null;
  tujuan_lat?: number | null;
  tujuan_lng?: number | null;
  detail_pengiriman?: DetailPengirimanRow | DetailPengirimanRow[] | null;
  tracking_pengiriman?: TrackingPengirimanRow[] | null;
  updated_at?: string | null;
  created_at?: string | null;
}

function formatUpdate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatEstimatedArrival(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getDetailPengirimanRow(row: PengirimanRow) {
  if (Array.isArray(row.detail_pengiriman)) {
    return row.detail_pengiriman[0] ?? null;
  }

  return row.detail_pengiriman ?? null;
}

// Mendapatkan lokasi tracking terbaru dari riwayat tracking pengiriman
function getLatestTrackingLocation(row: PengirimanRow): string | null {
  if (!row.tracking_pengiriman || row.tracking_pengiriman.length === 0) {
    return null;
  }
  const sorted = [...row.tracking_pengiriman].sort((a, b) => {
    return (
      new Date(b.waktu ?? b.created_at ?? 0).getTime() -
      new Date(a.waktu ?? a.created_at ?? 0).getTime()
    );
  });
  return sorted[0]?.lokasi ?? null;
}

function mapPengiriman(row: PengirimanRow): PengirimanItem {
  const fallbackId =
    row.id ??
    row.id_pengiriman ??
    row.no_resi ??
    row.noResi ??
    row.created_at ??
    crypto.randomUUID();

  return {
    id: String(fallbackId),
    noResi: row.no_resi ?? row.noResi ?? "-",
    pengirim: row.nama_pengirim ?? row.pengirim ?? "-",
    noTelpPengirim: row.no_hp_pengirim ?? "-",
    vendor: row.vendor ?? "-",
    penerima: row.nama_penerima ?? row.penerima ?? "-",
    noTelpPenerima: row.no_hp_penerima ?? "-",
    alamatAsal: row.alamat_asal ?? "-",
    alamat: row.alamat_tujuan ?? row.alamat ?? "-",
    status: row.status ?? "Pending",
    driver: row.driver ?? "-",
    update: formatUpdate(row.updated_at ?? row.created_at),
    estimatedArrival: formatEstimatedArrival(
      getDetailPengirimanRow(row)?.estimasi_sampai,
    ),
    asalLat: row.asal_lat ?? null,
    asalLng: row.asal_lng ?? null,
    tujuanLat: row.tujuan_lat ?? null,
    tujuanLng: row.tujuan_lng ?? null,
    currentLocation: getLatestTrackingLocation(row),
  };
}

function getSortTimestamp(row: PengirimanRow) {
  return new Date(row.updated_at ?? row.created_at ?? 0).getTime();
}

export async function getPengirimanList() {
  const { data, error } = await supabase.from("pengiriman").select(`
    *,
    detail_pengiriman (
      estimasi_sampai
    ),
    tracking_pengiriman (
      id_tracking,
      status,
      waktu,
      lokasi,
      keterangan,
      created_at
    )
  `);

  if (error) {
    logAppError("Get shipment list failed", error);
    return {
      success: false,
      error: error.message,
      data: [] as PengirimanItem[],
    };
  }

  const mappedData = ((data as PengirimanRow[] | null) ?? [])
    .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a))
    .map(mapPengiriman);

  return { success: true, data: mappedData };
}

export async function addPengiriman(data: PengirimanInput) {
  const { error, data: result } = await supabase.from("pengiriman").insert({
    no_resi: data.noResi,
    nama_pengirim: data.namaPengirim,
    no_hp_pengirim: data.noTelpPengirim,
    vendor: data.vendor,
    driver: data.driver,
    nama_penerima: data.namaPenerima,
    no_hp_penerima: data.noTelpPenerima,
    alamat_asal: data.alamatAsal,
    asal_lat: data.asalLat,
    asal_lng: data.asalLng,
    alamat_tujuan: data.alamatTujuan,
    tujuan_lat: data.tujuanLat,
    tujuan_lng: data.tujuanLng,
    status: "Pending",
  });

  if (error) {
    logAppError("Create shipment failed", error);
    return { success: false, error: error.message };
  }

  return { success: true, data: result };
}

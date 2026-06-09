import { createClient } from "@/lib/supabase/client";

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
  asalLat: number | null;
  asalLng: number | null;
  tujuanLat: number | null;
  tujuanLng: number | null;
}

interface PengirimanRow {
  id: string | number;
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

function mapPengiriman(row: PengirimanRow): PengirimanItem {
  return {
    id: String(row.id),
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
    asalLat: row.asal_lat ?? null,
    asalLng: row.asal_lng ?? null,
    tujuanLat: row.tujuan_lat ?? null,
    tujuanLng: row.tujuan_lng ?? null,
  };
}

function getSortTimestamp(row: PengirimanRow) {
  return new Date(row.updated_at ?? row.created_at ?? 0).getTime();
}

export async function getPengirimanList() {
  const { data, error } = await supabase.from("pengiriman").select("*");

  if (error) {
    console.error("Supabase fetch error:", error.message);
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
    console.error("Supabase insert error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: result };
}

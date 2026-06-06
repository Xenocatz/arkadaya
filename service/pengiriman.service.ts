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
  alamat: string;
}

export interface PengirimanItem {
  id: string;
  noResi: string;
  pengirim: string;
  noTelpPengirim: string;
  vendor: string;
  penerima: string;
  noTelpPenerima: string;
  alamat: string;
  status: string;
  driver: string;
  update: string;
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
  alamat_tujuan?: string | null;
  status?: string | null;
  driver?: string | null;
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
    alamat: row.alamat_tujuan ?? row.alamat ?? "-",
    status: row.status ?? "Pending",
    driver: row.driver ?? "-",
    update: formatUpdate(row.updated_at ?? row.created_at),
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
    alamat_tujuan: data.alamat,
    status: "Pending",
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: result };
}

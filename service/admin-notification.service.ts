import { createClient } from "@/lib/supabase/client";
import { logAppError } from "@/utils/error-message";

const supabase = createClient();

type NullableString = string | null | undefined;

interface TrackingPengirimanRow {
  id_tracking?: number | null;
  status?: NullableString;
  waktu?: NullableString;
  created_at?: NullableString;
}

interface PengirimanNotificationRow {
  id_pengiriman?: number | null;
  no_resi?: NullableString;
  nama_penerima?: NullableString;
  status?: NullableString;
  created_at?: NullableString;
  tracking_pengiriman?: TrackingPengirimanRow[] | null;
}

export interface AdminNotificationItem {
  id: string;
  waktu: string;
  judul: string;
  warnajudul: "orange" | "green";
  noResi: string;
  penerima: string;
}

function normalizeText(value?: NullableString) {
  return value?.trim().toLowerCase() ?? "";
}

function formatNotificationTime(value?: NullableString) {
  if (!value) return "-";

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

function getLatestTracking(
  trackingRows?: TrackingPengirimanRow[] | null,
): TrackingPengirimanRow | null {
  if (!trackingRows?.length) {
    return null;
  }

  return [...trackingRows].sort((a, b) => {
    const bTime = new Date(b.waktu ?? b.created_at ?? 0).getTime();
    const aTime = new Date(a.waktu ?? a.created_at ?? 0).getTime();
    return bTime - aTime;
  })[0] ?? null;
}

function getNotificationMeta(status?: NullableString) {
  const normalizedStatus = normalizeText(status);

  if (
    normalizedStatus === "delivered" ||
    normalizedStatus === "terkirim" ||
    normalizedStatus === "selesai"
  ) {
    return {
      judul: "Order telah diterima",
      warnajudul: "green" as const,
    };
  }

  if (normalizedStatus === "picked_up" || normalizedStatus === "picked up") {
    return {
      judul: "Paket telah di-pickup",
      warnajudul: "orange" as const,
    };
  }

  if (
    normalizedStatus === "in_transit" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "dalam pengiriman" ||
    normalizedStatus === "dalam perjalanan" ||
    normalizedStatus === "out_for_delivery"
  ) {
    return {
      judul: "Paket sedang dalam pengiriman",
      warnajudul: "orange" as const,
    };
  }

  if (normalizedStatus === "cancelled" || normalizedStatus === "dibatalkan") {
    return {
      judul: "Pengiriman dibatalkan",
      warnajudul: "orange" as const,
    };
  }

  return {
    judul: "Pengiriman baru dibuat",
    warnajudul: "orange" as const,
  };
}

function getSortTimestamp(row: PengirimanNotificationRow) {
  const latestTracking = getLatestTracking(row.tracking_pengiriman);
  return new Date(
    latestTracking?.waktu ??
      latestTracking?.created_at ??
      row.created_at ??
      0,
  ).getTime();
}

function mapNotification(
  row: PengirimanNotificationRow,
): AdminNotificationItem {
  const latestTracking = getLatestTracking(row.tracking_pengiriman);
  const status = latestTracking?.status ?? row.status;
  const meta = getNotificationMeta(status);

  return {
    id: String(
      latestTracking?.id_tracking ??
        row.id_pengiriman ??
        row.no_resi ??
        crypto.randomUUID(),
    ),
    waktu: formatNotificationTime(
      latestTracking?.waktu ?? latestTracking?.created_at ?? row.created_at,
    ),
    judul: meta.judul,
    warnajudul: meta.warnajudul,
    noResi: row.no_resi ?? "-",
    penerima: row.nama_penerima ?? "-",
  };
}

export async function getAdminNotifications(): Promise<AdminNotificationItem[]> {
  const { data, error } = await supabase
    .from("pengiriman")
    .select(
      `
      id_pengiriman,
      no_resi,
      nama_penerima,
      status,
      created_at,
      tracking_pengiriman (
        id_tracking,
        status,
        waktu,
        created_at
      )
    `,
    );

  if (error) {
    logAppError("Get admin notifications failed", error);
    throw new Error(error.message);
  }

  return ((data as PengirimanNotificationRow[] | null) ?? [])
    .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a))
    .slice(0, 12)
    .map(mapNotification);
}

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type NullableString = string | null | undefined;

interface CustomerProfile {
  id: string;
  nama: string;
  email: string;
}

interface DetailPengirimanRow {
  id_detail_pengiriman?: number | null;
  id_pengiriman?: number | null;
  estimasi_sampai?: NullableString;
  picked_up_at?: NullableString;
  in_transit_at?: NullableString;
  delivered_at?: NullableString;
  goods_receipt_url?: NullableString;
  delivery_invoice_url?: NullableString;
  catatan_pengiriman?: NullableString;
  created_at?: NullableString;
  updated_at?: NullableString;
}

interface TrackingPengirimanRow {
  id_tracking?: number | null;
  id_pengiriman?: number | null;
  status?: NullableString;
  waktu?: NullableString;
  lokasi?: NullableString;
  keterangan?: NullableString;
  created_at?: NullableString;
}

interface PengirimanRow {
  id_pengiriman?: number | null;
  id_user?: number | null;
  id_paket?: number | null;
  driver?: NullableString;
  no_resi?: NullableString;
  nama_penerima?: NullableString;
  no_hp_penerima?: NullableString;
  alamat_asal?: NullableString;
  alamat_tujuan?: NullableString;
  created_at?: NullableString;
  status?: NullableString;
  nama_pengirim?: NullableString;
  no_hp_pengirim?: NullableString;
  vendor?: NullableString;
  detail_pengiriman?: DetailPengirimanRow | DetailPengirimanRow[] | null;
  tracking_pengiriman?: TrackingPengirimanRow[] | null;
}

export interface CustomerOrder {
  id: string;
  receiptNumber: string;
  recipient: string;
  recipientPhone: string;
  sender: string;
  senderPhone: string;
  address: string;
  originAddress: string;
  driver: string;
  vendor: string;
  date: string;
  status: "On Progress" | "Delivered";
  statusLabel: string;
  estimatedArrival: string | null;
  goodsReceiptUrl: string | null;
  deliveryInvoiceUrl: string | null;
  notes: string | null;
  timeline: {
    time: string;
    title: string;
    icon: "box" | "truck" | "check";
  }[];
}

export interface CustomerNotification {
  id: string;
  time: string;
  title: string;
  receiptNumber: string;
  recipient: string;
  status: "picked_up" | "delivered";
}

export interface CustomerDashboardData {
  profile: CustomerProfile;
  orders: CustomerOrder[];
  notifications: CustomerNotification[];
}

function normalizeText(value?: NullableString) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeShipmentStatus(status?: NullableString) {
  const normalizedStatus = normalizeText(status);

  if (
    normalizedStatus === "delivered" ||
    normalizedStatus === "terkirim" ||
    normalizedStatus === "selesai"
  ) {
    return {
      status: "Delivered" as const,
      label: "Delivered",
    };
  }

  if (
    normalizedStatus === "picked_up" ||
    normalizedStatus === "picked up" ||
    normalizedStatus === "in_transit" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "out_for_delivery" ||
    normalizedStatus === "dalam pengiriman" ||
    normalizedStatus === "dalam perjalanan" ||
    normalizedStatus === "on progress"
  ) {
    return {
      status: "On Progress" as const,
      label: "On Progress",
    };
  }

  return {
    status: "On Progress" as const,
    label: status?.trim() || "Pending",
  };
}

function formatDate(value?: NullableString) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: NullableString) {
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

function formatTimelineTime(value?: NullableString) {
  if (!value) return "--:--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getSortTimestamp(row: PengirimanRow) {
  const detail = getDetailRow(row);

  return new Date(
    detail?.updated_at ?? detail?.created_at ?? row.created_at ?? 0,
  ).getTime();
}

function getDetailRow(row: PengirimanRow) {
  if (Array.isArray(row.detail_pengiriman)) {
    return row.detail_pengiriman[0] ?? null;
  }

  return row.detail_pengiriman ?? null;
}

function buildTimelineFromTracking(
  trackingRows: TrackingPengirimanRow[],
  detail: DetailPengirimanRow | null,
  fallbackStatusLabel: string,
) {
  const sortedTracking = [...trackingRows].sort((a, b) => {
    return new Date(a.waktu ?? 0).getTime() - new Date(b.waktu ?? 0).getTime();
  });

  const timelineFromTracking = sortedTracking
    .map((item) => {
      const status = normalizeText(item.status);

      if (status === "picked_up" || status === "picked up") {
        return {
          time: formatTimelineTime(item.waktu),
          title: "Pick Up",
          icon: "box" as const,
        };
      }

      if (
        status === "in_transit" ||
        status === "in transit" ||
        status === "out_for_delivery"
      ) {
        return {
          time: formatTimelineTime(item.waktu),
          title: "On Progress",
          icon: "truck" as const,
        };
      }

      if (status === "delivered") {
        return {
          time: formatTimelineTime(item.waktu),
          title: "Delivered",
          icon: "check" as const,
        };
      }

      return null;
    })
    .filter((item): item is CustomerOrder["timeline"][number] => item !== null);

  if (timelineFromTracking.length > 0) {
    return timelineFromTracking;
  }

  const fallbackTimeline: CustomerOrder["timeline"] = [];

  if (detail?.picked_up_at) {
    fallbackTimeline.push({
      time: formatTimelineTime(detail.picked_up_at),
      title: "Pick Up",
      icon: "box",
    });
  }

  if (detail?.in_transit_at || fallbackStatusLabel === "On Progress") {
    fallbackTimeline.push({
      time: formatTimelineTime(detail?.in_transit_at ?? detail?.picked_up_at),
      title: "On Progress",
      icon: "truck",
    });
  }

  if (detail?.delivered_at || fallbackStatusLabel === "Delivered") {
    fallbackTimeline.push({
      time: formatTimelineTime(detail?.delivered_at ?? detail?.in_transit_at),
      title: "Delivered",
      icon: "check",
    });
  }

  if (fallbackTimeline.length > 0) {
    return fallbackTimeline;
  }

  return [
    {
      time: "--:--",
      title: "Pick Up",
      icon: "box" as const,
    },
  ];
}

function mapOrder(row: PengirimanRow): CustomerOrder {
  const detail = getDetailRow(row);
  const trackingRows = row.tracking_pengiriman ?? [];
  const shipmentStatus = normalizeShipmentStatus(row.status);

  return {
    id: String(row.id_pengiriman ?? row.no_resi ?? "-"),
    receiptNumber: row.no_resi ?? "-",
    recipient: row.nama_penerima ?? "-",
    recipientPhone: row.no_hp_penerima ?? "-",
    sender: row.nama_pengirim ?? "-",
    senderPhone: row.no_hp_pengirim ?? "-",
    address: row.alamat_tujuan ?? "-",
    originAddress: row.alamat_asal ?? "Alamat asal belum tersedia",
    driver: row.driver ?? "-",
    vendor: row.vendor ?? "-",
    date: formatDate(row.created_at),
    status: shipmentStatus.status,
    statusLabel: shipmentStatus.label,
    estimatedArrival: formatDateTime(detail?.estimasi_sampai),
    goodsReceiptUrl: detail?.goods_receipt_url ?? null,
    deliveryInvoiceUrl: detail?.delivery_invoice_url ?? null,
    notes: detail?.catatan_pengiriman ?? null,
    timeline: buildTimelineFromTracking(
      trackingRows,
      detail,
      shipmentStatus.label,
    ),
  };
}

function buildNotifications(
  orders: CustomerOrder[],
  rows: PengirimanRow[],
): CustomerNotification[] {
  return orders.map((order, index) => {
    const trackingRows = rows[index]?.tracking_pengiriman ?? [];
    const latestTracking = [...trackingRows].sort((a, b) => {
      return (
        new Date(b.waktu ?? 0).getTime() - new Date(a.waktu ?? 0).getTime()
      );
    })[0];

    const normalizedTrackingStatus = normalizeText(latestTracking?.status);
    const isDelivered =
      normalizedTrackingStatus === "delivered" || order.status === "Delivered";

    return {
      id: `notif-${order.id}`,
      time: formatDateTime(latestTracking?.waktu ?? rows[index]?.created_at),
      title: isDelivered
        ? "Pesanan Anda Sudah Terkirim"
        : "Paket Anda Sedang Diproses",
      receiptNumber: order.receiptNumber,
      recipient: order.recipient,
      status: isDelivered ? "delivered" : "picked_up",
    };
  });
}

async function getCurrentCustomerProfile(): Promise<CustomerProfile> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  const user = authData.user;

  if (!user?.email) {
    throw new Error("Sesi pengguna tidak ditemukan.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("nama, email")
    .eq("email", user.email)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    id: user.id,
    nama: profile.nama,
    email: profile.email,
  };
}

export async function getCustomerDashboardData(): Promise<CustomerDashboardData> {
  const profile = await getCurrentCustomerProfile();
  const namaCustomer = profile.nama.trim();

  if (!namaCustomer) {
    throw new Error("Nama akun pengguna belum tersedia.");
  }

  const { data, error } = await supabase
    .from("pengiriman")
    .select(
      `
      id_pengiriman,
      id_user,
      id_paket,
      driver,
      no_resi,
      nama_penerima,
      no_hp_penerima,
      alamat_asal,
      alamat_tujuan,
      created_at,
      status,
      nama_pengirim,
      no_hp_pengirim,
      vendor,
      detail_pengiriman (
        id_detail_pengiriman,
        id_pengiriman,
        estimasi_sampai,
        picked_up_at,
        in_transit_at,
        delivered_at,
        goods_receipt_url,
        delivery_invoice_url,
        catatan_pengiriman,
        created_at,
        updated_at
      ),
      tracking_pengiriman (
        id_tracking,
        id_pengiriman,
        status,
        waktu,
        lokasi,
        keterangan,
        created_at
      )
    `,
    )
    .eq("nama_penerima", namaCustomer);

  if (error) {
    throw new Error(error.message);
  }

  const filteredRows = ((data as PengirimanRow[] | null) ?? []).sort(
    (a, b) => getSortTimestamp(b) - getSortTimestamp(a),
  );

  const orders = filteredRows.map(mapOrder);

  return {
    profile,
    orders,
    notifications: buildNotifications(orders, filteredRows),
  };
}

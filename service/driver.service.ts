import { createClient } from "@/lib/supabase/client";
import { logAppError } from "@/utils/error-message";

const supabase = createClient();

export interface DriverProfile {
  id: string;
  nama: string | null;
  email: string | null;
  no_hp: string | null;
  role: string | null;
}

export interface DriverProfileInput {
  nama: string;
  email: string;
  no_hp: string;
}

export async function getDriverProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nama, email, no_hp, role")
    .eq("role", "driver")
    .order("nama", { ascending: true });

  if (error) {
    logAppError("Get driver profiles failed", error);
    return {
      success: false,
      error: error.message,
      data: [] as DriverProfile[],
    };
  }

  return {
    success: true,
    data: (data ?? []) as DriverProfile[],
  };
}

export async function addDriverProfile({
  nama,
  email,
  no_hp,
}: DriverProfileInput) {
  const response = await fetch("/api/drivers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nama,
      email,
      no_hp,
    }),
  });

  const result = (await response.json()) as {
    success: boolean;
    error?: string;
    data?: unknown;
  };

  if (!response.ok || !result.success) {
    return {
      success: false,
      error: result.error ?? "Gagal menambahkan driver",
    };
  }

  return { success: true, data: result.data };
}

export async function updateDriverProfile(
  id: string,
  { nama, email, no_hp }: DriverProfileInput,
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      nama,
      email,
      no_hp,
    })
    .eq("id", id);

  if (error) {
    logAppError("Update driver profile failed", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

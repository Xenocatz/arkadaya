import { createClient } from "@/lib/supabase/client";

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
    console.error("Supabase fetch error:", error.message);
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
  const { data, error } = await supabase.from("profiles").insert({
    nama,
    email,
    no_hp,
    role: "driver",
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
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
    console.error("Supabase update error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

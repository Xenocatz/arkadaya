import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
export async function getUserProfile() {
  const { data: AuthData, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Supabase Auth Error:", error.message);
    return { success: false, error: error.message };
  }
  const email = AuthData.user?.email;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("nama, email, no_hp, role")
    .eq("email", email)
    .single();

  if (profileError) {
    console.error("Supabase select error:", profileError.message);
    return { success: false, error: profileError.message };
  }

  return profileData;
}

export async function updateUserProfile(nama: string, no_hp: string) {
  const { data: authData, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Supabase Auth Error:", error.message);
    return { success: false, error: error.message };
  }
  const email = authData.user?.email;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .update({ nama, no_hp })
    .eq("email", email)
    .single();

  if (profileError) {
    console.error("Supabase select error:", profileError.message);
    return { success: false, error: profileError.message };
  }

  return { success: true, profileData };
}

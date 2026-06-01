import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
export async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Supabase Auth Error:", error.message);
    return { success: false, error: error.message };
  }

  console.log("Sign up berhasil:", data);
  return { success: true, data };
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase Auth Error:", error.message);
    return { success: false, error: error.message };
  }

  console.log("Sign up berhasil:", data);
  return { success: true, data };
}

export async function addUserProfiles(
  nama: string,
  email: string,
  no_hp: string,
) {
  const { data, error } = await supabase.from("profiles").insert({
    nama,
    email,
    no_hp,
    role: "user",
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return { success: false, error: error.message };
  }

  console.log("Insert data berhasil:", data);
  return { success: true, data };
}

export async function checkForEmailAndRole(nama: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("nama", nama)
    .single();

  if (error) {
    console.error("Supabase select error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase Auth Error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

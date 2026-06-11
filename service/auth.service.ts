import { createClient } from "@/lib/supabase/client";
import { logAppError } from "@/utils/error-message";

const supabase = createClient();

export interface AuthProfile {
  nama: string;
  email: string;
  no_hp: string;
  role: string;
}

export async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    logAppError("Sign up auth failed", error);
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
    logAppError("Sign in auth failed", error);
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
    logAppError("Create user profile failed", error);
    return { success: false, error: error.message };
  }

  console.log("Insert data berhasil:", data);
  return { success: true, data };
}

export async function getProfileByEmail(email: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("nama, email, no_hp, role")
    .eq("email", email)
    .single();

  if (error) {
    logAppError("Get profile by email failed", error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as AuthProfile };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    logAppError("Sign out failed", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getCurrentAuthProfile() {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    logAppError("Get current auth user failed", authError);
    return { success: false, error: authError.message };
  }

  const email = authData.user?.email;

  if (!email) {
    return { success: false, error: "No active user session" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("nama, email, no_hp, role")
    .eq("email", email)
    .single<AuthProfile>();

  if (error) {
    logAppError("Get current auth profile failed", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

import { createClient } from "@/lib/supabase/client";
import { logAppError } from "@/utils/error-message";

const supabase = createClient();
const PROFILE_AVATAR_BUCKET = "profile_avatar";
const PROFILE_AVATAR_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
const MAX_PROFILE_AVATAR_SIZE_BYTES = 3 * 1024 * 1024;
const SUPABASE_PUBLIC_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
).trim().replace(/\/$/, "");

type NullableString = string | null | undefined;

interface ProfileRow {
  id: string;
  nama: NullableString;
  email: NullableString;
  no_hp: NullableString;
  role: NullableString;
  avatar_url?: NullableString;
}

type CurrentProfileResult =
  | {
      success: true;
      data: ProfileRow;
    }
  | {
      success: false;
      error: string;
    };

export interface UserProfile {
  id: string;
  nama: string | null;
  email: string | null;
  no_hp: string | null;
  role: string | null;
  avatarUrl: string | null;
}

const PROFILE_SELECT_WITH_AVATAR = "id, nama, email, no_hp, role, avatar_url";
const PROFILE_SELECT_BASE = "id, nama, email, no_hp, role";

function withCacheBuster(url?: NullableString) {
  if (!url) {
    return null;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Date.now()}`;
}

function buildPublicAvatarUrl(filePath: string) {
  if (!SUPABASE_PUBLIC_URL) {
    return filePath;
  }

  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${PROFILE_AVATAR_BUCKET}/${filePath}`;
}

function isMissingAvatarUrlColumn(message?: string) {
  return (
    message?.toLowerCase().includes("column profiles.avatar_url does not exist") ?? false
  );
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    nama: row.nama ?? null,
    email: row.email ?? null,
    no_hp: row.no_hp ?? null,
    role: row.role ?? null,
    avatarUrl: withCacheBuster(row.avatar_url),
  };
}

async function selectProfileByEmail(email: string) {
  const primaryQuery = await supabase
    .from("profiles")
    .select(PROFILE_SELECT_WITH_AVATAR)
    .eq("email", email)
    .single<ProfileRow>();

  if (!primaryQuery.error) {
    return primaryQuery;
  }

  if (!isMissingAvatarUrlColumn(primaryQuery.error.message)) {
    return primaryQuery;
  }

  const fallbackQuery = await supabase
    .from("profiles")
    .select(PROFILE_SELECT_BASE)
    .eq("email", email)
    .single<Omit<ProfileRow, "avatar_url">>();

  if (fallbackQuery.error) {
    return {
      data: null,
      error: fallbackQuery.error,
    };
  }

  return {
    data: {
      ...fallbackQuery.data,
      avatar_url: null,
    } satisfies ProfileRow,
    error: null,
  };
}

async function updateProfileById(
  id: string,
  values: { nama: string; no_hp: string },
) {
  const primaryQuery = await supabase
    .from("profiles")
    .update(values)
    .eq("id", id)
    .select(PROFILE_SELECT_WITH_AVATAR)
    .single<ProfileRow>();

  if (!primaryQuery.error) {
    return primaryQuery;
  }

  if (!isMissingAvatarUrlColumn(primaryQuery.error.message)) {
    return primaryQuery;
  }

  const fallbackQuery = await supabase
    .from("profiles")
    .update(values)
    .eq("id", id)
    .select(PROFILE_SELECT_BASE)
    .single<Omit<ProfileRow, "avatar_url">>();

  if (fallbackQuery.error) {
    return {
      data: null,
      error: fallbackQuery.error,
    };
  }

  return {
    data: {
      ...fallbackQuery.data,
      avatar_url: null,
    } satisfies ProfileRow,
    error: null,
  };
}

async function getCurrentProfileRow(): Promise<CurrentProfileResult> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    logAppError("Get current profile auth failed", authError);
    return { success: false, error: authError.message };
  }

  const email = authData.user?.email;

  if (!email) {
    return { success: false, error: "No active user session" };
  }

  const { data: profileData, error: profileError } = await selectProfileByEmail(email);

  if (profileError) {
    logAppError("Get current profile row failed", profileError);
    return { success: false, error: profileError.message };
  }

  return { success: true, data: profileData };
}

export async function getUserProfile() {
  const result = await getCurrentProfileRow();

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return mapProfile(result.data);
}

export async function updateUserProfile(nama: string, no_hp: string) {
  const currentProfile = await getCurrentProfileRow();

  if (!currentProfile.success) {
    return { success: false, error: currentProfile.error };
  }

  const { data: profileData, error: profileError } = await updateProfileById(
    currentProfile.data.id,
    { nama, no_hp },
  );

  if (profileError) {
    logAppError("Update user profile failed", profileError);
    return { success: false, error: profileError.message };
  }

  return { success: true, profileData: mapProfile(profileData) };
}

export async function uploadUserProfileAvatar(file: File) {
  if (file.size > MAX_PROFILE_AVATAR_SIZE_BYTES) {
    return {
      success: false,
      error: "Ukuran file foto profil maksimal 3 MB.",
    };
  }

  const currentProfile = await getCurrentProfileRow();

  if (!currentProfile.success) {
    return { success: false, error: currentProfile.error };
  }

  if (!("avatar_url" in currentProfile.data)) {
    return {
      success: false,
      error:
        "Kolom avatar_url belum ada di tabel profiles. Tambahkan kolom tersebut terlebih dahulu.",
    };
  }

  const profile = currentProfile.data;
  const fileNameParts = file.name.split(".");
  const extension = fileNameParts[fileNameParts.length - 1]?.toLowerCase();

  if (!extension) {
    return { success: false, error: "Format file avatar tidak valid." };
  }

  const basePath = `${profile.id}/avatar`;
  const filePath = `${basePath}.${extension}`;
  const publicAvatarUrl = buildPublicAvatarUrl(filePath);
  const filesToDelete = PROFILE_AVATAR_EXTENSIONS.map((ext) => `${basePath}.${ext}`).filter(
    (path) => path !== filePath,
  );

  if (filesToDelete.length > 0) {
    const { error: removeError } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .remove(filesToDelete);

    if (removeError) {
      logAppError("Remove previous profile avatar failed", removeError);
    }
  }

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_AVATAR_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    logAppError("Upload profile avatar failed", uploadError);
    return { success: false, error: uploadError.message };
  }

  const { error: profileError, data: profileData } = await supabase
    .from("profiles")
    .update({ avatar_url: publicAvatarUrl })
    .eq("id", profile.id)
    .select(PROFILE_SELECT_WITH_AVATAR)
    .single<ProfileRow>();

  if (profileError) {
    if (isMissingAvatarUrlColumn(profileError.message)) {
      return {
        success: false,
        error:
          "Kolom avatar_url belum ada di tabel profiles. Tambahkan kolom tersebut terlebih dahulu.",
      };
    }

    logAppError("Save profile avatar url failed", profileError);
    return { success: false, error: profileError.message };
  }

  return {
    success: true,
    profileData: mapProfile(profileData),
  };
}

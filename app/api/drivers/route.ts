import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface CreateDriverPayload {
  nama?: string;
  email?: string;
  no_hp?: string;
}

const DEFAULT_DRIVER_PASSWORD = "driver2243";

function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateDriverPayload;
  const nama = body.nama?.trim();
  const email = body.email?.trim().toLowerCase();
  const noHp = body.no_hp?.trim();

  if (!nama || !email || !noHp) {
    return NextResponse.json(
      { success: false, error: "Nama, email, dan nomor telepon wajib diisi." },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error:
          "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi, jadi akun auth driver belum bisa dibuat.",
      },
      { status: 500 },
    );
  }

  const { data: userData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: DEFAULT_DRIVER_PASSWORD,
      email_confirm: true,
      user_metadata: {
        nama,
        role: "driver",
      },
    });

  if (authError) {
    return NextResponse.json(
      { success: false, error: authError.message },
      { status: 400 },
    );
  }

  const createdUserId = userData.user?.id;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert({
      nama,
      email,
      no_hp: noHp,
      role: "driver",
    })
    .select()
    .single();

  if (profileError) {
    if (createdUserId) {
      await supabase.auth.admin.deleteUser(createdUserId);
    }

    return NextResponse.json(
      { success: false, error: profileError.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      profile: profileData,
      authUserId: createdUserId,
    },
  });
}

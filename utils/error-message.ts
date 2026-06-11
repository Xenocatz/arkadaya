const DEFAULT_ERROR_MESSAGE =
  "Terjadi kesalahan. Silakan coba lagi beberapa saat lagi.";

function normalizeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.trim();
  }

  if (typeof error === "string") {
    return error.trim();
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message.trim() : "";
  }

  return "";
}

function matches(message: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(message));
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  const rawMessage = normalizeErrorMessage(error);
  const message = rawMessage.toLowerCase();

  if (!message) {
    return DEFAULT_ERROR_MESSAGE;
  }

  if (
    matches(message, [
      /failed to fetch/,
      /network ?error/,
      /load failed/,
      /fetch failed/,
      /network request failed/,
      /connection/i,
    ])
  ) {
    return "Koneksi bermasalah. Periksa internet Anda lalu coba lagi.";
  }

  if (matches(message, [/timeout/, /timed out/, /aborted/])) {
    return "Permintaan terlalu lama diproses. Silakan coba lagi.";
  }

  if (
    matches(message, [
      /\b400\b/,
      /bad request/,
      /payload/,
      /malformed/,
    ])
  ) {
    return "Data yang dikirim belum sesuai. Periksa kembali isian formulir.";
  }

  if (
    matches(message, [
      /\b401\b/,
      /unauthorized/,
      /invalid login credentials/,
      /invalid credentials/,
      /email not confirmed/,
    ])
  ) {
    return "Email atau kata sandi tidak sesuai.";
  }

  if (
    matches(message, [
      /jwt expired/,
      /session expired/,
      /refresh token/,
      /invalid jwt/,
      /auth session missing/,
      /no active user session/,
    ])
  ) {
    return "Sesi login Anda telah berakhir. Silakan login kembali.";
  }

  if (
    matches(message, [
      /\b403\b/,
      /forbidden/,
      /row level security/,
      /\brls\b/,
      /permission denied/,
      /not allowed/,
      /policy/,
    ])
  ) {
    return "Anda tidak memiliki izin untuk melakukan tindakan ini.";
  }

  if (
    matches(message, [
      /\b404\b/,
      /not found/,
      /no rows/,
      /not exist/,
    ])
  ) {
    return "Data yang dicari tidak ditemukan.";
  }

  if (
    matches(message, [
      /\b409\b/,
      /duplicate key/,
      /already exists/,
      /already registered/,
      /already been registered/,
      /unique constraint/,
    ])
  ) {
    return "Data tersebut sudah terdaftar.";
  }

  if (
    matches(message, [
      /invalid input syntax/,
      /invalid format/,
      /syntax/,
      /cannot be cast/,
      /violates check constraint/,
    ])
  ) {
    return "Format data belum sesuai. Periksa kembali input yang dimasukkan.";
  }

  if (matches(message, [/file too large/, /too large/, /maximal 3 mb/])) {
    return "Ukuran file terlalu besar.";
  }

  if (
    matches(message, [
      /unsupported file type/,
      /invalid file type/,
      /mime/,
      /format file/,
      /file type/,
    ])
  ) {
    return "Format file tidak didukung.";
  }

  if (
    matches(message, [
      /photon/,
      /nominatim/,
      /alamat tidak ditemukan/,
      /reverse geocoding/,
    ])
  ) {
    return "Gagal mencari alamat. Periksa koneksi internet Anda.";
  }

  if (matches(message, [/akun tidak ditemukan/])) {
    return "Akun tidak ditemukan.";
  }

  if (matches(message, [/email sudah terdaftar/])) {
    return "Email sudah terdaftar.";
  }

  if (matches(message, [/nomor resi tidak ditemukan/])) {
    return "Nomor resi tidak ditemukan. Periksa kembali nomor resi Anda.";
  }

  return DEFAULT_ERROR_MESSAGE;
}

function sanitizeForLogging(error: unknown) {
  const message = normalizeErrorMessage(error)
    .replace(/sb_publishable_[A-Za-z0-9._-]+/g, "[redacted_publishable_key]")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[redacted_token]");

  if (error instanceof Error) {
    return {
      name: error.name,
      message,
      stack: error.stack,
    };
  }

  return message || "[unknown error]";
}

export function logAppError(context: string, error: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[AppError] ${context}`, sanitizeForLogging(error));
    return;
  }

  console.error(`[AppError] ${context}`);
}

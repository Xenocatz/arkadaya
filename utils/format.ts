export function formatCreatedAt(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function generateNoResi(date = new Date()): string {
  const tahunDuaDigit = String(date.getFullYear()).slice(-2);
  const tanggalDuaDigit = String(date.getDate()).padStart(2, "0");
  const timestampMillis = date.getTime();

  return `AHP00${tahunDuaDigit}${tanggalDuaDigit}${timestampMillis}`;
}

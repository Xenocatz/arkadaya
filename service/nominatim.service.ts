export type ReverseGeocodeResult = {
  label: string;
  latitude: number;
  longitude: number;
};

interface NominatimReverseResponse {
  display_name?: string;
  address?: {
    country?: string;
  };
}

function isIndonesiaCountry(country?: string) {
  return country?.trim().toLowerCase() === "indonesia";
}

export async function reverseGeocodeAddress(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<ReverseGeocodeResult> {
  const searchParams = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    "accept-language": "id",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${searchParams.toString()}`,
    {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil label alamat dari Nominatim.");
  }

  const data = (await response.json()) as NominatimReverseResponse;
  const label = data.display_name?.trim();

  if (!label || !isIndonesiaCountry(data.address?.country)) {
    throw new Error("Hasil reverse geocoding bukan lokasi di Indonesia.");
  }

  return {
    label,
    latitude,
    longitude,
  };
}

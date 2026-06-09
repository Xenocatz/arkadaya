export type AddressResult = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

interface PhotonFeature {
  properties?: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  geometry?: {
    coordinates?: [number, number];
  };
}

interface PhotonResponse {
  features?: PhotonFeature[];
}

function isIndonesiaFeature(feature: PhotonFeature) {
  const country = feature.properties?.country?.trim().toLowerCase() ?? "";
  return country === "indonesia";
}

function buildAddressLabel(feature: PhotonFeature) {
  const parts = [
    feature.properties?.name,
    feature.properties?.city,
    feature.properties?.state,
    feature.properties?.country,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return parts.join(", ");
}

export async function searchAddress(
  query: string,
  signal?: AbortSignal,
): Promise<AddressResult[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const response = await fetch(
    "https://photon.komoot.io/api/" +
      `?q=${encodeURIComponent(`${trimmedQuery}, Indonesia`)}` +
      "&limit=10",
    {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil suggestion alamat dari Photon API.");
  }

  const data = (await response.json()) as PhotonResponse;

  return (data.features ?? [])
    .filter(isIndonesiaFeature)
    .map((feature, index) => {
      const coordinates = feature.geometry?.coordinates;
      const label = buildAddressLabel(feature);

      if (!coordinates || coordinates.length < 2 || !label) {
        return null;
      }

      const [longitude, latitude] = coordinates;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return null;
      }

      return {
        id: `${label}-${latitude}-${longitude}-${index}`,
        label,
        latitude,
        longitude,
      };
    })
    .filter((item): item is AddressResult => item !== null);
}

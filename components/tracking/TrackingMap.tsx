"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { MapPin } from "lucide-react";

export interface TrackingMapPoint {
  latitude: number;
  longitude: number;
  label?: string;
}

interface TrackingMapProps {
  origin: TrackingMapPoint;
  destination: TrackingMapPoint;
  driverLocation?: TrackingMapPoint | null;
}

function isValidCoordinate(value: number) {
  return Number.isFinite(value);
}

function isValidPoint(point: TrackingMapPoint) {
  return (
    isValidCoordinate(point.latitude) &&
    isValidCoordinate(point.longitude)
  );
}

function createMarkerIcon(backgroundColor: string) {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9999px;background:${backgroundColor};border:2px solid white;box-shadow:0 8px 18px rgba(15,23,42,0.18);">
        <div style="width:10px;height:10px;border-radius:9999px;background:white;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const originIcon = createMarkerIcon("#111827");
const destinationIcon = createMarkerIcon("#0a4a8a");

// Ikon penanda posisi driver terkini dengan gambar truk/kendaraan
const driverIcon = L.divIcon({
  className: "custom-leaflet-driver-marker",
  html: `
    <div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:9999px;background:#f07f1b;border:2px solid white;box-shadow:0 8px 18px rgba(15,23,42,0.18);">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><polyline points="14 18 17 18 22 13 22 9 14 9"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function FitBounds({
  origin,
  destination,
  driver,
}: {
  origin: LatLngExpression;
  destination: LatLngExpression;
  driver: LatLngExpression | null;
}) {
  const map = useMap();

  useEffect(() => {
    const bounds: LatLngExpression[] = driver
      ? [origin, driver, destination]
      : [origin, destination];
    map.fitBounds(bounds as any, {
      padding: [60, 60],
      maxZoom: 15,
    });
  }, [destination, map, origin, driver]);

  return null;
}

function FallbackMapState() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100/90 px-6 text-center">
      <div className="space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0a4a8a] shadow-md">
          <MapPin className="h-7 w-7" />
        </div>
        <p className="text-base font-semibold text-slate-700">
          Lokasi belum tersedia
        </p>
      </div>
    </div>
  );
}

export default function TrackingMap({
  origin,
  destination,
  driverLocation,
}: TrackingMapProps) {
  if (!isValidPoint(origin) || !isValidPoint(destination)) {
    return <FallbackMapState />;
  }

  const originPosition: LatLngExpression = [origin.latitude, origin.longitude];
  const destinationPosition: LatLngExpression = [
    destination.latitude,
    destination.longitude,
  ];

  const driverPosition: LatLngExpression | null =
    driverLocation && isValidPoint(driverLocation)
      ? [driverLocation.latitude, driverLocation.longitude]
      : null;

  return (
    <div className="h-full w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
      <MapContainer
        center={destinationPosition}
        zoom={13}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={originPosition} icon={originIcon}>
          <Tooltip direction="top" offset={[0, -12]}>
            {origin.label ?? "Alamat asal"}
          </Tooltip>
        </Marker>

        <Marker position={destinationPosition} icon={destinationIcon}>
          <Tooltip direction="top" offset={[0, -12]}>
            {destination.label ?? "Alamat tujuan"}
          </Tooltip>
        </Marker>

        {driverPosition ? (
          <>
            <Marker position={driverPosition} icon={driverIcon}>
              <Tooltip direction="top" offset={[0, -12]}>
                {driverLocation?.label ?? "Lokasi Kurir"}
              </Tooltip>
            </Marker>

            {/* Rute yang sudah dilewati kurir (garis oranye tebal) */}
            <Polyline
              positions={[originPosition, driverPosition]}
              pathOptions={{
                color: "#f07f1b",
                weight: 5,
                opacity: 0.85,
              }}
            />

            {/* Rute sisa yang harus ditempuh (garis biru putus-putus) */}
            <Polyline
              positions={[driverPosition, destinationPosition]}
              pathOptions={{
                color: "#05336b",
                weight: 5,
                opacity: 0.85,
                dashArray: "10 8",
              }}
            />
          </>
        ) : (
          <Polyline
            positions={[originPosition, destinationPosition]}
            pathOptions={{
              color: "#05336b",
              weight: 5,
              opacity: 0.85,
              dashArray: "10 8",
            }}
          />
        )}

        <FitBounds
          origin={originPosition}
          destination={destinationPosition}
          driver={driverPosition}
        />
      </MapContainer>
    </div>
  );
}

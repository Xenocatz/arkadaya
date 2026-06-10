declare module "leaflet" {
  export type LatLngExpression = [number, number];
  export type LatLngBoundsExpression = [LatLngExpression, LatLngExpression];

  export interface DivIconOptions {
    className: string;
    html: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
  }

  export interface DivIcon {
    options: DivIconOptions;
  }

  export function divIcon(options: DivIconOptions): DivIcon;

  const Leaflet: {
    divIcon: typeof divIcon;
  };

  export default Leaflet;
}

declare module "react-leaflet" {
  import type { ReactNode } from "react";
  import type { DivIcon, LatLngBoundsExpression, LatLngExpression } from "leaflet";

  export interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    scrollWheelZoom?: boolean;
    zoomControl?: boolean;
    className?: string;
    children?: ReactNode;
  }

  export function MapContainer(props: MapContainerProps): ReactNode;

  export interface TileLayerProps {
    attribution: string;
    url: string;
  }

  export function TileLayer(props: TileLayerProps): ReactNode;

  export interface MarkerProps {
    position: LatLngExpression;
    icon?: DivIcon;
    children?: ReactNode;
  }

  export function Marker(props: MarkerProps): ReactNode;

  export interface TooltipProps {
    direction?: "top" | "bottom" | "left" | "right" | "center" | "auto";
    offset?: [number, number];
    children?: ReactNode;
  }

  export function Tooltip(props: TooltipProps): ReactNode;

  export interface PolylineProps {
    positions: LatLngExpression[];
    pathOptions?: {
      color?: string;
      weight?: number;
      opacity?: number;
      dashArray?: string;
    };
  }

  export function Polyline(props: PolylineProps): ReactNode;

  export function useMap(): {
    fitBounds: (
      bounds: LatLngBoundsExpression,
      options?: {
        padding?: [number, number];
        maxZoom?: number;
      },
    ) => void;
  };
}
